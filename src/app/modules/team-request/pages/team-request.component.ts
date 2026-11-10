import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {format, parse} from 'date-fns';
import {combineLatest, concatMap, distinctUntilChanged, filter, finalize, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../core/services/authorization/auth.service';
import {TeamService} from '../../../core/services/team/team.service';
import {IEEEuser} from '../../../shared/models/ieee-user/ieee-user';
import {
    ANIOS_INSCRIPCION, CARRERAS_INSCRIPCION, esEnlaceWeb, MEDIOS_DIFUSION,
    PlanIntercambio, RespuestasInscripcion, SolicitudIngreso
} from '../../../shared/models/solicitud-ingreso';
import {COMISIONES_INSCRIPCION, OPCIONES_ROL_EQUIPO, TEXTOS_INSCRIPCION} from './contenido-inscripcion';
import {AdaptadorFechaInscripcion, CalendarioInscripcionIntl} from './calendario-inscripcion';

function validarEnlace(control: AbstractControl): ValidationErrors | null {
    return !control.value || esEnlaceWeb(control.value.trim()) ? null : {enlace: true};
}

function validarFecha(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const fecha = control.value;
    return fecha instanceof Date && !Number.isNaN(fecha.getTime()) && fecha <= new Date() ? null : {fecha: true};
}

@Component({
    selector: 'app-team-request',
    templateUrl: './team-request.component.html',
    styleUrls: ['./team-request.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AdaptadorFechaInscripcion},
        {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
        {provide: MatDatepickerIntl, useClass: CalendarioInscripcionIntl}
    ]
})
export class TeamRequestComponent implements OnInit, OnDestroy {
    readonly carreras = CARRERAS_INSCRIPCION;
    readonly anios = ANIOS_INSCRIPCION;
    readonly textos = TEXTOS_INSCRIPCION;
    readonly guiaComisiones = COMISIONES_INSCRIPCION;
    readonly rolesEquipo = OPCIONES_ROL_EQUIPO;
    readonly medios = MEDIOS_DIFUSION;
    readonly hoy = new Date();
    readonly formulario = this.creadorFormulario.group({
        nombres: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
        apellidos: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
        correoContacto: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), Validators.maxLength(254)]],
        legajo: ['', [Validators.required, Validators.pattern(/^\d{1,12}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^[+]?([ ()-]*[0-9]){7,15}[ ()-]*$/), Validators.maxLength(25)]],
        fechaNacimiento: [null as Date | null, [Validators.required, validarFecha]],
        carrera: ['', Validators.required],
        anioCarrera: ['', Validators.required],
        intercambio: ['', Validators.required],
        primeraComision: ['', Validators.required],
        segundaComision: [''],
        rolEquipo: ['', Validators.required],
        trabaja: [null as boolean | null, Validators.required],
        habilidades: ['', Validators.maxLength(2000)],
        conocioIEEE: ['', Validators.required],
        otroMedioIEEE: ['', Validators.maxLength(200)],
        conocioConvocatoria: ['', Validators.required],
        otroMedioConvocatoria: ['', Validators.maxLength(200)],
        enlaceVideo: ['', [validarEnlace, Validators.maxLength(2000)]],
        linkedin: ['', [validarEnlace, Validators.maxLength(500)]]
    }, {validators: (grupo: AbstractControl) => {
        const valores = grupo.value;
        if (valores.primeraComision && valores.primeraComision === valores.segundaComision) return {comisionesRepetidas: true};
        if (valores.conocioIEEE === 'Otro' && !valores.otroMedioIEEE?.trim()) return {otroMedioIEEE: true};
        if (valores.conocioConvocatoria === 'Otro' && !valores.otroMedioConvocatoria?.trim()) return {otroMedioConvocatoria: true};
        return null;
    }});

    usuario: IEEEuser | null = null;
    comisiones: {id: string; titulo: string}[] = [];
    inscripcionesAbiertas = false;
    cargando = true;
    cargandoSolicitud = true;
    falloCarga = false;
    enviando = false;
    procesandoFoto = false;
    verificando = false;
    editando = false;
    intentoEnvio = false;
    foto: string | null = null;
    tipoImagen: string;
    solicitud: SolicitudIngreso | null = null;
    error = '';
    aviso = '';
    conoceComision: boolean | null = null;
    private readonly destruido = new Subject<void>();

    constructor(
        private creadorFormulario: FormBuilder,
        private autorizacion: AuthService,
        private equipo: TeamService,
        private ruta: ActivatedRoute,
        private navegador: Router
    ) {}

    ngOnInit(): void {
        combineLatest([this.equipo.getAllCommissions(), this.equipo.getIsTeamRequestOpen()])
            .pipe(takeUntil(this.destruido)).subscribe({
                next: ([comisiones, abiertas]) => {
                    this.comisiones = this.guiaComisiones.filter(guia =>
                        comisiones.some(comision => comision.id === guia.id && comision.positions?.length)
                    );
                    this.inscripcionesAbiertas = abiertas;
                    this.cargando = false;
                },
                error: () => {
                    this.cargando = false;
                    this.falloCarga = true;
                    this.error = 'No pudimos cargar la inscripción. Recargá la página para volver a intentar.';
                }
            });
        this.autorizacion.getCurrentUser().pipe(
            tap(usuario => {
                if (usuario && !this.usuario) {
                    this.foto = usuario.photoURL;
                    this.formulario.patchValue({linkedin: usuario.linkedin || '', correoContacto: usuario.email});
                }
                this.usuario = usuario;
            }),
            filter(usuario => !!usuario),
            distinctUntilChanged((anterior, siguiente) => anterior.email === siguiente.email),
            switchMap(usuario => this.equipo.obtenerSolicitud(usuario.email)),
            takeUntil(this.destruido)
        ).subscribe({
            next: solicitud => {
                this.solicitud = solicitud;
                this.cargandoSolicitud = false;
                if (solicitud?.estado === 'aceptada') this.editando = false;
            },
            error: () => {
                this.cargandoSolicitud = false;
                this.falloCarga = true;
                this.error = 'No pudimos consultar tu solicitud. Recargá la página antes de enviarla.';
            }
        });
        if (this.ruta.snapshot.queryParamMap.get('verified') === 'true') this.comprobarCorreo();
    }

    ngOnDestroy(): void {
        this.destruido.next();
        this.destruido.complete();
    }

    cambiarPrimeraComision(): void {
        if (this.formulario.value.primeraComision === this.formulario.value.segundaComision) {
            this.formulario.patchValue({segundaComision: ''});
        }
    }

    editarSolicitud(): void {
        if (!this.solicitud || this.solicitud.estado === 'aceptada') return;
        const respuestas = this.solicitud.respuestas;
        if (respuestas) {
            this.formulario.patchValue({
                ...respuestas,
                fechaNacimiento: parse(respuestas.fechaNacimiento, 'yyyy-MM-dd', new Date()),
                conocioIEEE: this.medios.includes(respuestas.conocioIEEE) ? respuestas.conocioIEEE : 'Otro',
                otroMedioIEEE: this.medios.includes(respuestas.conocioIEEE) ? '' : respuestas.conocioIEEE,
                conocioConvocatoria: this.medios.includes(respuestas.conocioConvocatoria) ? respuestas.conocioConvocatoria : 'Otro',
                otroMedioConvocatoria: this.medios.includes(respuestas.conocioConvocatoria) ? '' : respuestas.conocioConvocatoria,
                enlaceVideo: respuestas.enlaceVideo || ''
            });
        }
        this.formulario.patchValue({
            correoContacto: respuestas?.correoContacto || this.solicitud.email,
            primeraComision: this.solicitud.commissionid,
            segundaComision: this.solicitud.segundaComisionId || '',
            linkedin: this.solicitud.linkedin || ''
        });
        this.foto = this.solicitud.photo;
        this.editando = true;
        this.aviso = '';
    }

    enviarSolicitud(): void {
        this.intentoEnvio = true;
        this.formulario.markAllAsTouched();
        if (this.formulario.invalid || this.enviando || this.procesandoFoto || !this.usuario?.verifiedEmail || !this.inscripcionesAbiertas
            || this.cargandoSolicitud || this.falloCarga || this.solicitud?.estado === 'aceptada') return;
        const datos = this.formulario.getRawValue();
        const existeComision = (id: string) => this.comisiones.some(comision => comision.id === id);
        if (!existeComision(datos.primeraComision) || (datos.segundaComision && !existeComision(datos.segundaComision))) {
            this.error = 'Elegí una comisión disponible.';
            return;
        }
        this.error = '';
        this.aviso = '';
        this.enviando = true;
        const respuestas: RespuestasInscripcion = {
            nombres: datos.nombres.trim(), apellidos: datos.apellidos.trim(),
            correoContacto: datos.correoContacto.trim(),
            legajo: datos.legajo.trim(), telefono: datos.telefono.trim(),
            fechaNacimiento: format(datos.fechaNacimiento, 'yyyy-MM-dd'), carrera: datos.carrera, anioCarrera: datos.anioCarrera,
            intercambio: datos.intercambio as PlanIntercambio, rolEquipo: datos.rolEquipo, trabaja: datos.trabaja,
            habilidades: datos.habilidades.trim(),
            conocioIEEE: datos.conocioIEEE === 'Otro' ? datos.otroMedioIEEE.trim() : datos.conocioIEEE,
            conocioConvocatoria: datos.conocioConvocatoria === 'Otro' ? datos.otroMedioConvocatoria.trim() : datos.conocioConvocatoria,
            enlaceVideo: datos.enlaceVideo.trim() || null
        };
        const perfil = {...this.usuario, fullname: `${respuestas.nombres} ${respuestas.apellidos}`, linkedin: datos.linkedin.trim() || null};
        const cambioDeFoto = this.foto !== this.usuario.photoURL && (!this.foto || this.foto.startsWith('data:'));
        const imagen = cambioDeFoto ? this.autorizacion.updateProfilePic(this.foto, this.tipoImagen) : of(this.foto);
        imagen.pipe(
            concatMap(foto => {
                perfil.photoURL = foto;
                return this.autorizacion.updateProfile(perfil);
            }),
            concatMap(() => this.equipo.enviarSolicitud({
                name: perfil.fullname, email: perfil.email, photo: perfil.photoURL, linkedin: perfil.linkedin,
                gender: this.solicitud?.gender ?? null, commissionid: datos.primeraComision, positionid: null,
                segundaComisionId: datos.segundaComision || null, respuestas
            })),
            finalize(() => this.enviando = false),
            takeUntil(this.destruido)
        ).subscribe({
            next: () => {
                this.editando = false;
                this.aviso = '¡Recibimos tu solicitud! El equipo la va a revisar y se pondrá en contacto con vos.';
            },
            error: () => this.error = 'No pudimos enviar la solicitud. Revisá tu conexión y que la convocatoria siga abierta. Tus respuestas siguen en el formulario.'
        });
    }

    enviarVerificacion(): void {
        if (this.verificando) return;
        this.verificando = true;
        const enlace = new URL(window.location.href);
        enlace.searchParams.set('verified', 'true');
        this.autorizacion.sendVerificationEmail(enlace.toString()).pipe(
            finalize(() => this.verificando = false), takeUntil(this.destruido)
        ).subscribe({
            next: () => this.aviso = 'Te enviamos un correo. Abrí el enlace y después presioná «Ya verifiqué mi correo».',
            error: () => this.error = 'No pudimos enviar el correo. Esperá unos minutos y volvé a intentar.'
        });
    }

    comprobarCorreo(): void {
        if (this.verificando) return;
        this.verificando = true;
        this.autorizacion.reloadToken().pipe(finalize(() => this.verificando = false), takeUntil(this.destruido)).subscribe({
            next: () => {
                if (this.usuario) this.usuario = {...this.usuario, verifiedEmail: this.autorizacion.user.emailVerified};
                this.aviso = this.usuario?.verifiedEmail ? 'Tu correo está verificado.' : 'Tu correo todavía no está verificado.';
                void this.navegador.navigate([], {queryParams: {verified: null}, queryParamsHandling: 'merge', replaceUrl: true});
            },
            error: () => this.error = 'No pudimos comprobar tu correo. Volvé a intentar.'
        });
    }
}

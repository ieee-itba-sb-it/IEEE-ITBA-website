import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, finalize, Subject, takeUntil} from 'rxjs';
import {AdminService} from '../../../../core/services/admin/admin.service';
import {TeamService} from '../../../../core/services/team/team.service';
import {Commission} from '../../../../shared/models/commission';
import {AsignacionSolicitud, esEnlaceWeb, EstadoSolicitud, SolicitudIngreso} from '../../../../shared/models/solicitud-ingreso';

interface SolicitudSeleccionable extends SolicitudIngreso {
    seleccionada: boolean;
    comisionElegida: string;
    cargoElegido: string;
}

@Component({
    selector: 'app-team-requests',
    templateUrl: './team-requests.component.html',
    styleUrls: ['./team-requests.component.css']
})
export class TeamRequestsComponent implements OnInit, OnDestroy {
    solicitudes: SolicitudSeleccionable[] = [];
    comisiones: Commission[] = [];
    estadoFiltro: EstadoSolicitud = 'pendiente';
    inscripcionesAbiertas = false;
    cargando = true;
    procesando = false;
    cambiandoConvocatoria = false;
    error = '';
    aviso = '';
    readonly esEnlaceWeb = esEnlaceWeb;
    private readonly destruido = new Subject<void>();

    constructor(private administracion: AdminService, private equipo: TeamService) {}

    ngOnInit(): void {
        combineLatest([
            this.administracion.obtenerSolicitudes(),
            this.equipo.getAllCommissions(),
            this.equipo.getIsTeamRequestOpen()
        ]).pipe(takeUntil(this.destruido)).subscribe({
            next: ([solicitudes, comisiones, abiertas]) => {
                const anteriores = new Map(this.solicitudes.map(solicitud => [solicitud.email, solicitud]));
                this.comisiones = comisiones;
                this.inscripcionesAbiertas = abiertas;
                this.solicitudes = solicitudes.map(solicitud => {
                    const anterior = anteriores.get(solicitud.email);
                    const pendiente = (solicitud.estado ?? 'pendiente') === 'pendiente';
                    return {
                        ...solicitud,
                        seleccionada: pendiente && (anterior?.seleccionada ?? false),
                        comisionElegida: anterior?.comisionElegida || solicitud.comisionAsignadaId || solicitud.commissionid,
                        cargoElegido: anterior?.cargoElegido || (solicitud.cargoAsignadoId || solicitud.positionid
                            ? JSON.stringify([solicitud.cargoAsignadoId || solicitud.positionid, solicitud.gender || 'M']) : '')
                    };
                }).sort((primera, segunda) => (segunda.fechaEnvio?.toMillis() ?? 0) - (primera.fechaEnvio?.toMillis() ?? 0));
                this.cargando = false;
            },
            error: () => {
                this.cargando = false;
                this.error = 'No pudimos cargar las solicitudes. Revisá tu conexión y recargá la página.';
            }
        });
    }

    ngOnDestroy(): void {
        this.destruido.next();
        this.destruido.complete();
    }

    get solicitudesVisibles(): SolicitudSeleccionable[] {
        return this.solicitudes.filter(solicitud => (solicitud.estado ?? 'pendiente') === this.estadoFiltro);
    }

    get seleccionadas(): SolicitudSeleccionable[] {
        return this.solicitudes.filter(solicitud => solicitud.seleccionada && (solicitud.estado ?? 'pendiente') === 'pendiente');
    }

    get puedeAceptar(): boolean {
        return this.seleccionadas.length > 0 && this.seleccionadas.length <= 20 && this.seleccionadas.every(solicitud =>
            this.opcionesCargo(solicitud.comisionElegida, solicitud.gender).some(cargo => cargo.valor === solicitud.cargoElegido)
        );
    }

    buscarComision(id: string): Commission | undefined {
        return this.comisiones.find(comision => comision.id === id);
    }

    nombreComision(id: string): string {
        return this.buscarComision(id)?.title.es || id || 'Sin segunda opción';
    }

    opcionesCargo(comisionId: string, generoAnterior?: string): {valor: string; cargoId: string; generoCargo: 'F' | 'M'; titulo: string}[] {
        return (this.buscarComision(comisionId)?.positions || []).flatMap(cargo => {
            const generos: ('F' | 'M')[] = cargo.title.F.es === cargo.title.M.es
                ? [generoAnterior === 'F' ? 'F' : 'M'] : ['F', 'M'];
            return generos.map(generoCargo => ({
                valor: JSON.stringify([cargo.id, generoCargo]), cargoId: cargo.id,
                generoCargo, titulo: cargo.title[generoCargo].es
            }));
        });
    }

    nombreCargo(solicitud: SolicitudSeleccionable): string {
        const cargo = this.buscarComision(solicitud.comisionAsignadaId)?.positions?.find(posicion => posicion.id === solicitud.cargoAsignadoId);
        return cargo?.title[solicitud.gender || 'M']?.es || solicitud.cargoAsignadoId || '';
    }

    cambiarFiltro(): void {
        this.solicitudes.forEach(solicitud => solicitud.seleccionada = false);
        this.aviso = '';
    }

    aceptarSeleccionadas(): void {
        if (!this.puedeAceptar || this.procesando) return;
        const asignaciones: AsignacionSolicitud[] = this.seleccionadas.map(solicitud => {
            const cargo = this.opcionesCargo(solicitud.comisionElegida, solicitud.gender)
                .find(opcion => opcion.valor === solicitud.cargoElegido);
            return {correo: solicitud.email, comisionId: solicitud.comisionElegida, cargoId: cargo.cargoId, generoCargo: cargo.generoCargo};
        });
        this.procesando = true;
        this.error = '';
        this.aviso = '';
        this.administracion.aceptarSolicitudes(asignaciones).pipe(
            finalize(() => this.procesando = false), takeUntil(this.destruido)
        ).subscribe({
            next: () => this.aviso = 'Las solicitudes seleccionadas fueron aceptadas. Los perfiles del equipo ya están actualizados.',
            error: error => this.mostrarError(error)
        });
    }

    rechazarSeleccionadas(): void {
        if (!this.seleccionadas.length || this.seleccionadas.length > 20 || this.procesando) return;
        const correos = this.seleccionadas.map(solicitud => solicitud.email);
        this.procesando = true;
        this.error = '';
        this.aviso = '';
        this.administracion.rechazarSolicitudes(correos).pipe(
            finalize(() => this.procesando = false), takeUntil(this.destruido)
        ).subscribe({
            next: () => this.aviso = 'Las solicitudes fueron rechazadas. Sus respuestas se conservan en el historial privado.',
            error: error => this.mostrarError(error)
        });
    }

    cambiarConvocatoria(): void {
        if (this.cambiandoConvocatoria) return;
        this.cambiandoConvocatoria = true;
        this.error = '';
        this.equipo.setIsTeamRequestOpen(!this.inscripcionesAbiertas).pipe(
            finalize(() => this.cambiandoConvocatoria = false), takeUntil(this.destruido)
        ).subscribe({error: () => this.error = 'No pudimos cambiar el estado de la convocatoria. Volvé a intentar.'});
    }

    private mostrarError(error: {code?: string; message?: string}): void {
        this.error = !error.code && error.message ? error.message : 'No pudimos procesar las solicitudes. Revisá tu conexión y volvé a intentar.';
    }
}

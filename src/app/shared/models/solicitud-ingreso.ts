import {Timestamp} from '@angular/fire/firestore';
import {TeamMember} from './team-member';

export type EstadoSolicitud = 'pendiente' | 'aceptada' | 'rechazada';
export type PlanIntercambio = 'Sí' | 'No' | 'Tal vez';

export interface RespuestasInscripcion {
    nombres: string;
    apellidos: string;
    correoContacto?: string;
    legajo: string;
    telefono: string;
    fechaNacimiento: string;
    carrera: string;
    anioCarrera: string;
    intercambio: PlanIntercambio;
    rolEquipo: string;
    trabaja: boolean;
    habilidades: string;
    conocioIEEE: string;
    conocioConvocatoria: string;
    enlaceVideo: string | null;
}

export interface SolicitudIngreso extends Omit<TeamMember, 'positionid' | 'gender'> {
    gender?: string | null;
    positionid: string | null;
    segundaComisionId?: string | null;
    respuestas?: RespuestasInscripcion;
    estado?: EstadoSolicitud;
    fechaEnvio?: Timestamp;
    fechaRevision?: Timestamp;
    comisionAsignadaId?: string;
    cargoAsignadoId?: string;
}

export interface AsignacionSolicitud {
    correo: string;
    comisionId: string;
    cargoId: string;
    generoCargo: 'F' | 'M';
}

export interface OpcionInscripcion {
    valor: string;
    clave: string;
}

function opciones(grupo: string, pares: [string, string][]): OpcionInscripcion[] {
    return pares.map(([valor, clave]) => ({valor, clave: `TEAM_REQUEST.OPTIONS.${grupo}.${clave}`}));
}

// Los valores se guardan en Firestore y las reglas los validan: cambiarlos rompe las solicitudes existentes.
export const CARRERAS_INSCRIPCION = opciones('CAREERS', [
    ['Lic. en Analítica Empresarial y Social', 'BUSINESS_ANALYTICS'], ['Lic. en Gestión de Negocios', 'BUSINESS_MANAGEMENT'],
    ['Bioingeniería', 'BIOENGINEERING'], ['Ing. Electrónica', 'ELECTRONICS'], ['Ing. Industrial', 'INDUSTRIAL'],
    ['Ing. Informática', 'COMPUTER'], ['Ing. Mecánica', 'MECHANICAL'], ['Ing. Naval', 'NAVAL'],
    ['Ing. en Petróleo', 'PETROLEUM'], ['Ing. Química', 'CHEMICAL'], ['Ing. Civil', 'CIVIL'],
    ['Ingeniería en Biotecnología', 'BIOTECHNOLOGY']
]);

export const ANIOS_INSCRIPCION = opciones('YEARS', [
    ['Ingreso', 'ADMISSION'], ['Primero', 'FIRST'], ['Segundo', 'SECOND'], ['Tercero', 'THIRD'],
    ['Cuarto', 'FOURTH'], ['Quinto', 'FIFTH'], ['Graduado', 'GRADUATE']
]);

export const OPCIONES_INTERCAMBIO = opciones('EXCHANGE', [['Sí', 'YES'], ['No', 'NO'], ['Tal vez', 'MAYBE']]);

export const OPCIONES_ROL_EQUIPO = opciones('ROLES', [
    ['Líder', 'LEADER'], ['Coordinador/a', 'COORDINATOR'], ['Jugador/a de equipo', 'TEAM_PLAYER'],
    ['Miembro formal', 'FORMAL_MEMBER'], ['Detrás de escena', 'BACKSTAGE']
]);

export const NOMBRES_ROL_EQUIPO = opciones('ROLE_NAMES', OPCIONES_ROL_EQUIPO.map(rol =>
    [rol.valor, rol.clave.split('.').pop()] as [string, string]));

export const MEDIOS_DIFUSION = opciones('MEDIA', [
    ['Conocido', 'ACQUAINTANCE'], ['Instagram', 'INSTAGRAM'], ['Curso de Python', 'PYTHON_COURSE'],
    ['Campus del ITBA', 'CAMPUS'], ['YouTube', 'YOUTUBE'], ['LinkedIn', 'LINKEDIN'],
    ['Nuestra página web', 'WEBSITE'], ['Otro', 'OTHER']
]);

export function esMedioDifusion(valor: string): boolean {
    return MEDIOS_DIFUSION.some(medio => medio.valor === valor);
}

/** Clave de i18n de un valor guardado, o null si es texto libre (por ejemplo, la respuesta de «Otro»). */
export function claveOpcion(lista: OpcionInscripcion[], valor: string): string | null {
    return lista.find(opcion => opcion.valor === valor)?.clave ?? null;
}

export function esEnlaceWeb(valor: string): boolean {
    if (/\s/.test(valor)) return false;
    try {
        const enlace = new URL(valor);
        return ['https:', 'http:'].includes(enlace.protocol) && !!enlace.hostname
            && !enlace.username && !enlace.password;
    } catch {
        return false;
    }
}

export function obtenerMiembroPublico(solicitud: SolicitudIngreso, asignacion: AsignacionSolicitud): TeamMember {
    return {
        name: solicitud.name,
        email: asignacion.correo,
        gender: asignacion.generoCargo,
        photo: solicitud.photo ?? null,
        linkedin: solicitud.linkedin ?? null,
        commissionid: asignacion.comisionId,
        positionid: asignacion.cargoId
    };
}

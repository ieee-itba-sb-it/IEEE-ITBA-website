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

export const CARRERAS_INSCRIPCION = [
    'Lic. en Analítica Empresarial y Social', 'Lic. en Gestión de Negocios',
    'Bioingeniería', 'Ing. Electrónica', 'Ing. Industrial', 'Ing. Informática',
    'Ing. Mecánica', 'Ing. Naval', 'Ing. en Petróleo', 'Ing. Química',
    'Ing. Civil', 'Ingeniería en Biotecnología'
];

export const ANIOS_INSCRIPCION = ['Ingreso', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto', 'Graduado'];
export const MEDIOS_DIFUSION = ['Conocido', 'Instagram', 'Curso de Python', 'Campus del ITBA', 'YouTube', 'LinkedIn', 'Nuestra página web', 'Otro'];

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

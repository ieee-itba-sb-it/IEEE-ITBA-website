import { Injectable } from '@angular/core';
import {
    CollectionReference,
    Firestore,
    Query,
    QueryConstraint,
    collection,
    doc,
    endBefore,
    getCountFromServer,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter,
    startAt,
    where,
    writeBatch,
    runTransaction, DocumentData, arrayUnion, onSnapshot, serverTimestamp
} from '@angular/fire/firestore';
import {defer, from, Observable} from 'rxjs';
import { IEEEuser } from 'src/app/shared/models/ieee-user/ieee-user';
import { IEEEUserFilters } from 'src/app/shared/models/ieee-user/ieee-user-filters';
import {AsignacionSolicitud, obtenerMiembroPublico, SolicitudIngreso} from '../../../shared/models/solicitud-ingreso';
import {Commission} from '../../../shared/models/commission';
import {roles} from "../../../shared/models/roles/roles.enum";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    collectionName: string;
    collection: CollectionReference;

    private static readonly COMMISSION_COLLECTION_NAME = 'commissions';
    private static readonly MEMBERS_COLLECTION_NAME = 'members';
    private static readonly USERS_COLLECTION_NAME = 'users';
    private static readonly SENSITIVE_USER_DATA_COLLECTION_NAME = 'sensitive-user-data';

    constructor(private afs: Firestore) {}

    setCollectionName(collectionName: string) {
        this.collectionName = collectionName;
        this.collection = collection(this.afs, collectionName);
    }

    private getCount(query: Query): Observable<number> {
        return new Observable<number>(obs => {
            getCountFromServer(query).then(snap => {
                obs.next(snap.data().count);
            }).catch(err => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        })
    }

    getTotalCount(filters?: IEEEUserFilters) {
        let constraints: QueryConstraint[] = [];
        if (filters?.email) {
            let end: string = filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
            constraints.push(where('email', '>=', filters.email), where('email', '<', end));
        }
        if (filters?.roles) constraints.push(where('roles','array-contains-any', filters.roles));
        return this.getCount(query(this.collection, ...constraints));
    }

    private getUsersPage(query: Query): Observable<IEEEuser[]> {
        return new Observable<IEEEuser[]>(obs => {
            getDocs(query).then(data => {
                const ans: IEEEuser[] = [];
                for (const blogEntry in data.docs) {
                    if (data.docs.hasOwnProperty(blogEntry)) {
                        const doc: IEEEuser = data.docs[blogEntry].data() as IEEEuser;
                        ans.push(doc);
                    }
                }
                obs.next(ans);
            }).catch(err => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        })
    }

    getUsersFirstPage(size: number, filters?: IEEEUserFilters): Observable<IEEEuser[]> {
        let constraints: QueryConstraint[] = [limit(size), orderBy("email")];
        if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
        if (filters?.roles) constraints.push(where('roles', 'array-contains-any', filters.roles));
        const q = query(this.collection, ...constraints);
        return this.getUsersPage(q);
    }

    getUsersNextPage(last:   IEEEuser, size: number, filters?: IEEEUserFilters) {
        let constraints: QueryConstraint[] = [limit(size), orderBy("email"), startAfter(last.email)];
        if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
        if (filters?.roles) constraints.push(where('roles', 'array-contains-any', filters.roles));
        const q = query(this.collection, ...constraints);
        return this.getUsersPage(q);
    }

    getUsersPrevPage(first: IEEEuser, size: number, filters?: IEEEUserFilters) {
        let constraints: QueryConstraint[] = [limitToLast(size), orderBy("email"), endBefore(first.email)];
        if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
        if (filters?.roles) constraints.push(where('roles', 'array-contains-any', filters.roles));
        const q = query(this.collection, ...constraints);
        return this.getUsersPage(q);
    }


    refreshUserPage(first: IEEEuser, size: number, filters?: IEEEUserFilters) {
        let constraints: QueryConstraint[] = [limit(size), orderBy("email"), startAt(first.email)];
        if (filters?.email) constraints.push(where('email', '>=', filters.email), where('email', '<', filters.email.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1))));
        if (filters?.roles) constraints.push(where('roles', 'array-contains-any', filters.roles));
        const q = query(this.collection, ...constraints);
        return this.getUsersPage(q);
    }

    updateUser(user: IEEEuser, updateRole: boolean): Observable<IEEEuser> {
        const roleDocument = { roles: user.roles };
        return new Observable(obs => {
            const batch = writeBatch(this.afs);
            batch.set(doc(this.afs, "users", user.email), user);
            if (updateRole) batch.set(doc(this.afs, "sensitive-user-data", user.email), roleDocument);
            batch.commit().then(res => {
                obs.next(user);
            }).catch(err => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        })
    }

    obtenerSolicitudes(): Observable<SolicitudIngreso[]> {
        return new Observable(suscriptor => onSnapshot(collection(this.afs, 'team-requests'),
            resultado => suscriptor.next(resultado.docs.map(documento => ({
                ...documento.data(), email: documento.id
            } as SolicitudIngreso))),
            error => suscriptor.error(error)
        ));
    }

    aceptarSolicitudes(asignaciones: AsignacionSolicitud[]): Observable<void> {
        return defer(() => from(runTransaction(this.afs, async transaccion => {
            if (!asignaciones.length || asignaciones.length > 20) {
                throw new Error('Seleccioná entre 1 y 20 solicitudes.');
            }
            if (new Set(asignaciones.map(asignacion => asignacion.correo)).size !== asignaciones.length) {
                throw new Error('Hay solicitudes repetidas.');
            }
            const documentos = await Promise.all(asignaciones.map(async asignacion => {
                if (!asignacion.comisionId || !asignacion.cargoId || !['F', 'M'].includes(asignacion.generoCargo)) {
                    throw new Error('Asigná una comisión y un cargo a cada persona.');
                }
                const solicitudRef = doc(this.afs, 'team-requests', asignacion.correo);
                const usuarioRef = doc(this.afs, AdminService.USERS_COLLECTION_NAME, asignacion.correo);
                const rolesRef = doc(this.afs, AdminService.SENSITIVE_USER_DATA_COLLECTION_NAME, asignacion.correo);
                const [solicitud, usuario, comision] = await Promise.all([
                    transaccion.get(solicitudRef),
                    transaccion.get(usuarioRef),
                    transaccion.get(doc(this.afs, 'commissions', asignacion.comisionId))
                ]);
                if (!solicitud.exists() || (solicitud.data().estado ?? 'pendiente') !== 'pendiente') {
                    throw new Error('Una solicitud ya fue revisada. Actualizá la selección.');
                }
                if (!usuario.exists()) throw new Error('No se encontró la cuenta de una de las personas.');
                const datosComision = comision.data() as Commission;
                if (!datosComision?.positions?.some(cargo => cargo.id === asignacion.cargoId)) {
                    throw new Error('El cargo seleccionado no pertenece a esa comisión.');
                }
                return {asignacion, solicitudRef, usuarioRef, rolesRef, solicitud: solicitud.data() as SolicitudIngreso};
            }));
            for (const documento of documentos) {
                const {asignacion, solicitudRef, usuarioRef, rolesRef, solicitud} = documento;
                transaccion.set(rolesRef, {roles: arrayUnion(roles.member)}, {merge: true});
                transaccion.update(usuarioRef, {roles: arrayUnion(roles.member)});
                transaccion.set(
                    doc(this.afs, 'commissions', asignacion.comisionId, 'members', asignacion.correo),
                    obtenerMiembroPublico(solicitud, asignacion)
                );
                transaccion.update(solicitudRef, {
                    estado: 'aceptada',
                    gender: asignacion.generoCargo,
                    comisionAsignadaId: asignacion.comisionId,
                    cargoAsignadoId: asignacion.cargoId,
                    fechaRevision: serverTimestamp()
                });
            }
        })));
    }

    rechazarSolicitudes(correos: string[]): Observable<void> {
        return defer(() => from(runTransaction(this.afs, async transaccion => {
            if (!correos.length || correos.length > 20) {
                throw new Error('Seleccioná entre 1 y 20 solicitudes.');
            }
            const documentos = await Promise.all(correos.map(correo =>
                transaccion.get(doc(this.afs, 'team-requests', correo))
            ));
            for (const documento of documentos) {
                if (!documento.exists() || (documento.data().estado ?? 'pendiente') !== 'pendiente') {
                    throw new Error('Una solicitud ya fue revisada. Actualizá la selección.');
                }
                transaccion.update(documento.ref, {estado: 'rechazada', fechaRevision: serverTimestamp()});
            }
        })));
    }
}

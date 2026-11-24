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
import {getRequestStatus, TeamRequest, TeamRequestAssignment, toPublicMember} from '../../../shared/models/team-request';
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
    private static readonly TEAM_REQUESTS_COLLECTION_NAME = 'team-requests';
    static readonly MAX_REVIEWED_REQUESTS = 20;

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

    getTeamRequests(): Observable<TeamRequest[]> {
        return new Observable(subscriber => onSnapshot(collection(this.afs, AdminService.TEAM_REQUESTS_COLLECTION_NAME),
            snapshot => subscriber.next(snapshot.docs.map(request => ({
                ...request.data(), email: request.id
            } as TeamRequest))),
            error => subscriber.error(error)
        ));
    }

    acceptTeamRequests(assignments: TeamRequestAssignment[]): Observable<void> {
        return defer(() => from(runTransaction(this.afs, async transaction => {
            if (!assignments.length || assignments.length > AdminService.MAX_REVIEWED_REQUESTS) {
                throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.LIMIT');
            }
            if (new Set(assignments.map(assignment => assignment.email)).size !== assignments.length) {
                throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.DUPLICATED');
            }
            const documents = await Promise.all(assignments.map(async assignment => {
                if (!assignment.commissionId || !assignment.positionId || !['F', 'M'].includes(assignment.positionGender)) {
                    throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.MISSING_ASSIGNMENT');
                }
                const requestRef = doc(this.afs, AdminService.TEAM_REQUESTS_COLLECTION_NAME, assignment.email);
                const userRef = doc(this.afs, AdminService.USERS_COLLECTION_NAME, assignment.email);
                const rolesRef = doc(this.afs, AdminService.SENSITIVE_USER_DATA_COLLECTION_NAME, assignment.email);
                const [request, user, commission] = await Promise.all([
                    transaction.get(requestRef),
                    transaction.get(userRef),
                    transaction.get(doc(this.afs, 'commissions', assignment.commissionId))
                ]);
                if (!request.exists() || getRequestStatus(request.data() as TeamRequest) !== 'pending') {
                    throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.ALREADY_REVIEWED');
                }
                if (!user.exists()) throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.ACCOUNT_NOT_FOUND');
                const commissionData = commission.data() as Commission;
                if (!commissionData?.positions?.some(position => position.id === assignment.positionId)) {
                    throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.INVALID_POSITION');
                }
                return {assignment, requestRef, userRef, rolesRef, request: request.data() as TeamRequest};
            }));
            for (const {assignment, requestRef, userRef, rolesRef, request} of documents) {
                transaction.set(rolesRef, {roles: arrayUnion(roles.member)}, {merge: true});
                transaction.update(userRef, {roles: arrayUnion(roles.member)});
                transaction.set(
                    doc(this.afs, 'commissions', assignment.commissionId, 'members', assignment.email),
                    toPublicMember(request, assignment)
                );
                transaction.update(requestRef, {
                    status: 'accepted',
                    gender: assignment.positionGender,
                    assignedCommissionId: assignment.commissionId,
                    assignedPositionId: assignment.positionId,
                    reviewedAt: serverTimestamp()
                });
            }
        })));
    }

    rejectTeamRequests(emails: string[]): Observable<void> {
        return defer(() => from(runTransaction(this.afs, async transaction => {
            if (!emails.length || emails.length > AdminService.MAX_REVIEWED_REQUESTS) {
                throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.LIMIT');
            }
            const requests = await Promise.all(emails.map(email =>
                transaction.get(doc(this.afs, AdminService.TEAM_REQUESTS_COLLECTION_NAME, email))
            ));
            for (const request of requests) {
                if (!request.exists() || getRequestStatus(request.data() as TeamRequest) !== 'pending') {
                    throw new Error('ADMIN.TEAMREQUESTSTAB.ERRORS.ALREADY_REVIEWED');
                }
                transaction.update(request.ref, {status: 'rejected', reviewedAt: serverTimestamp()});
            }
        })));
    }
}

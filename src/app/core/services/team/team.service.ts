import {IEEEMember} from '../../../shared/models/team-member';
import {Injectable} from '@angular/core';
import {Commission, Position} from 'src/app/shared/models/commission';
import {Observable} from 'rxjs';
import {CommissionType, Role} from '../../../shared/models/ieee-user/ieee-team.enums';
import {
    arrayRemove,
    arrayUnion,
    collection, collectionGroup, deleteDoc, doc, DocumentData,
    Firestore, FirestoreError,
    getDoc,
    getDocs, orderBy, Query,
    query, runTransaction, setDoc, updateDoc,
    where, writeBatch
} from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import {AdminService} from "../admin/admin.service";
import {roles} from "../../../shared/models/roles/roles.enum";
import {SensitiveUserData} from "../../../shared/models/ieee-user/ieee-user";
import {firestore} from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;

interface IEEEUserRole extends IEEEMember {
    roleType: Role;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private static readonly TEAM_REQUESTS_COLLECTION_NAME = 'team-requests';
    private static readonly COMMISSION_COLLECTION_NAME = 'commissions';
    private static readonly MEMBERS_COLLECTION_NAME = 'members';
    private static readonly USERS_COLLECTION_NAME = 'users';
    private static readonly SENSITIVE_USER_DATA_COLLECTION_NAME = 'sensitive-user-data';
    private static readonly METADATA_COLLECTION_NAME = 'collection-metadata';

    constructor(private afs: Firestore) {}

    static TEAM_MAPPER = {
        [CommissionType.CD]: 'HOME.CARGO.CD.TITLE',
        [CommissionType.MEDIACOM]: 'HOME.CARGO.MEDIACOM.TITLE',
        [CommissionType.ID]: 'HOME.CARGO.ID.TITLE',
        [CommissionType.EDUCATION]: 'HOME.CARGO.EDUCATION.TITLE',
        [CommissionType.FUNDRAISING]: 'HOME.CARGO.FUNDRAISING.TITLE',
        [CommissionType.IT]: 'HOME.CARGO.IT.TITLE',
        [CommissionType.RAS]: 'RAS',
        [CommissionType.EMB]: 'EMB'
    };
    // getCurrentTeam(): Observable<Commission[]> {
    //     return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    //         getDocs(query(collection(this.afs, TeamService.TEAM_COLLECTION_NAME), where('commission', 'not-in', [CommissionType.RAS, CommissionType.EMB]))).then(res => {
    //             subscriber.next(res)
    //         });
    //     }).pipe(map(TeamService.mapQuerySnapshotToCommission));
    // }
    //
    // getRasTeam(): Observable<Commission> {
    //     return this.getSingularTeam(CommissionType.RAS);
    // }
    //
    // getEmbTeam(): Observable<Commission> {
    //     return this.getSingularTeam(CommissionType.EMB);
    // }

    // private getSingularTeam(commissionType: CommissionType): Observable<Commission> {
    //     return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
    //         getDocs(query(collection(this.afs, TeamService.TEAM_COLLECTION_NAME), where('commission', '==', commissionType))).then(res => {
    //             subscriber.next(res);
    //         })
    //     })
    //     .pipe(map(TeamService.mapQuerySnapshotToCommission))
    //     .pipe(map(commissions => {
    //         if (commissions.length === 0) return {
    //             name: TeamService.TEAM_MAPPER[CommissionType.RAS],
    //             team: []
    //         }
    //         return commissions[0];
    //     }));
    // }

    // private static mapQuerySnapshotToCommission(querySnapshot: QuerySnapshot<DocumentData>): Commission[] {
    //     if (querySnapshot.empty) return [];
    //     const commissionMap = new Map<string, IEEEUserRole[]>();
    //     querySnapshot.forEach(doc => {
    //         const userResponse: IEEEUserResponse = doc.data() as IEEEUserResponse;
    //         if (!commissionMap.has(userResponse.commission)) {
    //             commissionMap.set(userResponse.commission, []);
    //         }
    //         commissionMap.get(userResponse.commission).push({ ...IEEEMember.fromIeeeUserResponse(userResponse), roleType: userResponse.roles });
    //     });
    //
    //     return [...commissionMap.entries()].map(([commission, team]) => {
    //         return {
    //             name: TeamService.TEAM_MAPPER[commission],
    //             team: team.sort((a, b) => {
    //                 return ROLE_ORDER.indexOf(a.roleType) - ROLE_ORDER.indexOf(b.roleType);
    //             }),
    //             commission: commission as CommissionType,
    //         }
    //     }).sort((a, b) => {
    //         return COMMISSION_ORDER.indexOf(a.commission) - COMMISSION_ORDER.indexOf(b.commission);
    //     });
    // }
    private getCommissions(query: Query): Observable<Commission[]> {
        return new Observable<Commission[]>(obs => {
            getDocs(query).then(data => {
                const ans: Commission[] = data.docs.map(commission => {
                    return commission.data() as Commission;
                });
                obs.next(ans);
            }).catch((err: FirebaseError) => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        })
    }

    getAllCommissions(): Observable<Commission[]> {
        return this.getCommissions(query(
            collection(this.afs, TeamService.COMMISSION_COLLECTION_NAME),
            orderBy("order")
        ))
    }

    getTeamCommissions(): Observable<Commission[]> {
        return this.getCommissions(query(
            collection(this.afs, TeamService.COMMISSION_COLLECTION_NAME),
            where("main", "==", true),
            orderBy("order")
        ));
    }

    getComissionByID(id: string): Observable<Commission> {
        return new Observable<Commission>(subscriber => {
            getDoc(doc(this.afs, TeamService.COMMISSION_COLLECTION_NAME, id)).then(res => {
                subscriber.next(res.data() as Commission);
            })
        })
    }

    addMembers(members: IEEEMember[], commission: Commission): Observable<IEEEMember[]> {
        return new Observable(obs => {
            runTransaction(this.afs, async (transaction) => {
                let documents: DocumentData[] = [];
                for(let i = 0; i < members.length; i++) {
                    documents[i] = await transaction.get(doc(this.afs, TeamService.SENSITIVE_USER_DATA_COLLECTION_NAME, members[i].email));
                }
                for(let i = 0; i < members.length; i++) {
                    if (documents[i].exists()) {
                        transaction.update(doc(this.afs, TeamService.SENSITIVE_USER_DATA_COLLECTION_NAME, members[i].email), {roles: arrayUnion(roles.member)});
                    } else {
                        transaction.set(doc(this.afs, TeamService.SENSITIVE_USER_DATA_COLLECTION_NAME, members[i].email), {roles: [roles.member]});
                    }
                    transaction.set(doc(this.afs, TeamService.COMMISSION_COLLECTION_NAME, commission.id, TeamService.MEMBERS_COLLECTION_NAME, members[i].email), {...members[i]});
                    transaction.update(doc(this.afs, TeamService.USERS_COLLECTION_NAME, members[i].email), {roles: arrayUnion(roles.member)});
                }
            }).then((res) => {
                obs.next(members);
            }).catch((err: FirebaseError) => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        });
    }

    removeMember(member: IEEEMember, commission: Commission): Observable<IEEEMember> {
        return new Observable(obs => {
            runTransaction(this.afs, async (transaction) => {
                transaction.delete(doc(this.afs, TeamService.COMMISSION_COLLECTION_NAME, commission.id, TeamService.MEMBERS_COLLECTION_NAME, member.email));
                const fetch = await getDocs(query(collectionGroup(this.afs, TeamService.MEMBERS_COLLECTION_NAME), where("email", "==", member.email)));
                if(fetch.docs.length <= 1) {
                    transaction.update(doc(this.afs, TeamService.USERS_COLLECTION_NAME, member.email), {roles: arrayRemove(roles.member)});
                    transaction.update(doc(this.afs, TeamService.SENSITIVE_USER_DATA_COLLECTION_NAME, member.email), {roles: arrayRemove(roles.member)});
                }
            }).then((res) => {
                obs.next(member);
            }).catch((err: FirebaseError) => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        });
    }

    setCommission(commission: Commission) : Observable<Commission> {
        let commissionCopy: Commission = structuredClone(commission);
        delete commissionCopy.members;
        commissionCopy.positions.forEach(position => {
            delete position.members;
        });
        return new Observable(obs => {
            const batch = writeBatch(this.afs);
            batch.set(doc(this.afs, "commissions", commissionCopy.id), commissionCopy);
            batch.commit().then(() => {
                obs.next(commissionCopy);
            }).catch((err: FirebaseError) => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        });
    }

    private getMembers(query : Query) : Observable<IEEEMember[]> {
        return new Observable<IEEEMember[]>(obs => {
            getDocs(query).then(res => {
                const ans: IEEEMember[] = res.docs.map(member => {
                    return member.data() as IEEEMember;
                });
                obs.next(ans);
            }).catch((err: FirebaseError) => {
                obs.error(err);
            }).finally(() => {
                obs.complete();
            });
        });
    }

    getMembersByCommission(commission : Commission) : Observable<IEEEMember[]> {
        return this.getMembers(query(
            collection(this.afs, TeamService.COMMISSION_COLLECTION_NAME, commission.id, TeamService.MEMBERS_COLLECTION_NAME)
        ));
    }

    getAllMembers() : Observable<IEEEMember[]> {
        return this.getMembers(collectionGroup(this.afs, TeamService.MEMBERS_COLLECTION_NAME));
    }

    createTeamRequest(member: IEEEMember) {
        let data = {...member};
        if (data.photo == undefined) delete data.photo;
        return new Observable<boolean>(obs => {
            setDoc(doc(this.afs, "team-requests", member.email), data)
                .then(() => obs.next(true))
                .catch((err: FirestoreError) => obs.error(err));
        })
    }

    getIsTeamRequestOpen() {
        return new Observable<boolean>(subscriber => {
            getDoc(doc(this.afs, TeamService.METADATA_COLLECTION_NAME, TeamService.TEAM_REQUESTS_COLLECTION_NAME)).then(snap => {
                subscriber.next((snap.data().open ?? false) as boolean);
            }).catch(err => subscriber.error(err));
        })
    }

    setIsTeamRequestOpen(open: boolean) {
        return new Observable<void>(subscriber => {
            setDoc(
                doc(this.afs, TeamService.METADATA_COLLECTION_NAME, TeamService.TEAM_REQUESTS_COLLECTION_NAME),
                { open }
            )
                .then(() => subscriber.next())
                .catch(err => subscriber.error(err));
        })
    }
}

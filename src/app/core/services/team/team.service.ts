import {IEEEMember} from '../../../shared/models/team-member';
import {Injectable} from '@angular/core';
import {Commission} from 'src/app/shared/models/commission';
import {map, Observable} from 'rxjs';
import {IEEEUserResponse} from '../../../shared/models/ieee-user/ieee-user.response';
import {COMMISSION_ORDER, CommissionType, Role, ROLE_ORDER} from '../../../shared/models/ieee-user/ieee-team.enums';
import { collection, DocumentData, Firestore, getDocs, query, QuerySnapshot, where } from '@angular/fire/firestore';

interface IEEEUserRole extends IEEEMember {
    roleType: Role;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private static readonly TEAM_COLLECTION_NAME = 'team';
    
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

    getCurrentTeam(): Observable<Commission[]> {
        return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
            getDocs(query(collection(this.afs, TeamService.TEAM_COLLECTION_NAME), where('commission', 'not-in', [CommissionType.RAS, CommissionType.EMB]))).then(res => {
                subscriber.next(res)
            });
        }).pipe(map(TeamService.mapQuerySnapshotToCommission));
    }

    getRasTeam(): Observable<Commission> {
        return this.getSingularTeam(CommissionType.RAS);
    }

    getEmbTeam(): Observable<Commission> {
        return this.getSingularTeam(CommissionType.EMB);
    }

    private getSingularTeam(commissionType: CommissionType): Observable<Commission> {
        return new Observable<QuerySnapshot<DocumentData>>((subscriber) => {
            getDocs(query(collection(this.afs, TeamService.TEAM_COLLECTION_NAME), where('commission', '==', commissionType))).then(res => {
                subscriber.next(res);
            })
        })
        .pipe(map(TeamService.mapQuerySnapshotToCommission))
        .pipe(map(commissions => {
            if (commissions.length === 0) return {
                name: TeamService.TEAM_MAPPER[CommissionType.RAS],
                team: []
            }
            return commissions[0];
        }));
    }

    private static mapQuerySnapshotToCommission(querySnapshot: QuerySnapshot<DocumentData>): Commission[] {
        if (querySnapshot.empty) return [];
        const commissionMap = new Map<string, IEEEUserRole[]>();
        querySnapshot.forEach(doc => {
            const userResponse: IEEEUserResponse = doc.data() as IEEEUserResponse;
            if (!commissionMap.has(userResponse.commission)) {
                commissionMap.set(userResponse.commission, []);
            }
            commissionMap.get(userResponse.commission).push({ ...IEEEMember.fromIeeeUserResponse(userResponse), roleType: userResponse.role });
        });

        return [...commissionMap.entries()].map(([commission, team]) => {
            return {
                name: TeamService.TEAM_MAPPER[commission],
                team: team.sort((a, b) => {
                    return ROLE_ORDER.indexOf(a.roleType) - ROLE_ORDER.indexOf(b.roleType);
                }),
                commission: commission as CommissionType,
            }
        }).sort((a, b) => {
            return COMMISSION_ORDER.indexOf(a.commission) - COMMISSION_ORDER.indexOf(b.commission);
        });
    }
}

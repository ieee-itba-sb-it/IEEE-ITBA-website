import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AdminService} from "../../../../core/services/admin/admin.service";
import {IEEEMember} from "../../../../shared/models/team-member";
import {roles} from "../../../../shared/models/roles/roles";
import {Commission, Position} from "../../../../shared/models/commission";
import {TeamService} from "../../../../core/services/team/team.service";

type SelectableIEEEMember = IEEEMember & { selected: boolean };

@Component({
    selector: 'app-team-requests',
    templateUrl: './team-requests.component.html',
    styleUrls: ['./team-requests.component.css']
})

export class TeamRequestsComponent implements OnInit {
    loading: BehaviorSubject<boolean> = new BehaviorSubject(true);
    areRequestOpen: boolean;
    requests: SelectableIEEEMember[];
    commissions: Commission[];

    loadingAccept: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loadingReject: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loadingOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private adminService: AdminService, private teamService: TeamService) {}

    ngOnInit() {
        this.teamService.getIsTeamRequestOpen().subscribe(isTeamRequestOpen => {
            this.areRequestOpen = isTeamRequestOpen;
        })
        this.adminService.getTeamRequests().subscribe(requests => {
            this.requests = requests.map(request => ({selected: false, ...request}))
        });
        this.teamService.getAllCommissions().subscribe(commissions => {
            this.commissions = commissions;
        })
    }

    acceptSelectedRequests() {
        this.loadingAccept.next(true);
        this.adminService.acceptTeamRequests(this.getMappedSelectedRequests()).subscribe({
            next: () => {
                this.loadingAccept.next(false);
                this.requests = this.requests.filter(r => !r.selected);
            },
            error: () => {
                this.loadingAccept.next(false);
                // Mostrar modal de error
            }
        })
    }

    rejectSelectedRequests() {
        this.loadingReject.next(true);
        this.adminService.rejectTeamRequests(this.getMappedSelectedRequests()).subscribe({
            next: () => {
                this.loadingReject.next(false);
                this.requests = this.requests.filter(r => !r.selected);
            },
            error: () => {
                this.loadingReject.next(false);
                // Mostrar modal de error
            }
        })
    }

    setRequestsOpen(open: boolean) {
        this.loadingOpen.next(true)
        this.teamService.setIsTeamRequestOpen(open).subscribe({
            next: () => {
                this.areRequestOpen = open;
                this.loadingOpen.next(false);
            }, error: (err) => {
                console.error(err);
                this.loadingOpen.next(false);
            }
        })
    }

    findCommission(id: string): Commission {
        return this.commissions.find(commission => commission.id === id);
    }

    findPosition(commission: Commission, id: string): Position {
        return commission.positions.find((position) => position.id === id);
    }

    selectRequest(index: number, selected: boolean) {
        this.requests[index].selected = selected;
    }

    getMappedSelectedRequests() {
        return this.getSelectedRequests().map(selectable => {
            let {selected, ...request} = selectable;
            return request;
        });
    }

    getSelectedRequests() {
        return this.requests.filter(r => r.selected);
    }

    protected readonly roles = roles;
    protected readonly Array = Array;

}

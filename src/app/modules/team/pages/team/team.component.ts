import {TeamService} from '../../../../core/services/team/team.service';
import {Component, OnInit} from '@angular/core';
import {Team} from 'src/app/shared/models/team';
import {Commission} from '../../../../shared/models/commission';
import {forkJoin, Observable, zipWith} from 'rxjs';
import {IEEEMember} from "../../../../shared/models/team-member";
import {zip} from "rxjs/internal/operators/zip";

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

    commissions$: Observable<Commission[]>;
    members$: Observable<IEEEMember[]>;

    team: Commission[];

    constructor(private teamService: TeamService) {
        this.commissions$ = this.teamService.getTeamCommissions()
        this.members$ = this.teamService.getAllMembers()
    }

    ngOnInit() {
        forkJoin([this.commissions$, this.members$]).subscribe({
            next: ([commissions, members]) => {
                this.team = commissions;
                for (let commission of this.team) {
                    for (let position of commission.positions) {
                        position.members = members.filter(member =>
                            member.commissionid == commission.id &&
                            member.positionid == position.id
                        );
                    }
                }
            }
        })
    }
}

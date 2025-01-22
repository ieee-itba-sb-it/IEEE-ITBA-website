import {TeamService} from '../../../../core/services/team/team.service';
import {Component, OnInit} from '@angular/core';
import {Team} from 'src/app/shared/models/team';
import {Commission} from '../../../../shared/models/commission';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

    teams: Team[] = null;
    team$: Observable<Commission[]> = null;
    constructor(private teamService: TeamService) {
    }

    ngOnInit(): void {
        this.team$ = this.teamService.getTeamCommissions();
        this.team$.subscribe(team => {
            console.log(team);
        });
        // this.team$.subscribe(team => {
        //     team.forEach((commission: Commission) => {
        //         commission.positions.forEach(position => {
        //             position.members.forEach(member => {
        //
        //             })
        //         });
        //     });
        // });
    }
}

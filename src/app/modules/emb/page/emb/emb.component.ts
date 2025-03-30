import {Component, OnInit} from '@angular/core';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import {Observable, zip} from 'rxjs';

@Component({
    selector: 'app-emb',
    templateUrl: './emb.component.html',
    styleUrls: ['./emb.component.css']
})
export class EmbComponent implements OnInit {

    team: Commission = null;

    constructor( private teamService: TeamService) {

    }

    ngOnInit(): void {
        zip([
            this.teamService.getCommissionByID("EMB"),
            this.teamService.getMembersByCommission("EMB")
        ]).subscribe(([commission, members]) => {
            this.team = commission;
            this.team.positions.forEach(position => {
                position.members = members.filter(member => member.positionid == position.id);
            });
        })
    }

}

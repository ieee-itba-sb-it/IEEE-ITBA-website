import {Component, OnInit} from '@angular/core';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-emb',
    templateUrl: './emb.component.html',
    styleUrls: ['./emb.component.css']
})
export class EmbComponent implements OnInit {

    team$: Observable<Commission> = null;

    constructor( private teamService: TeamService) {

    }

    ngOnInit(): void {
        // this.team$ = this.teamService.getEmbTeam();
    }

}

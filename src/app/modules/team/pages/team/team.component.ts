import {TeamService} from '../../../../core/services/team/team.service';
import {Component, OnInit} from '@angular/core';
import {Team} from 'src/app/shared/models/team';
import {Commission} from '../../../../shared/models/commission';
import {Observable} from 'rxjs';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

    teams: Team[] = null;
    team$: Observable<Commission[]> = null;
    constructor(private teamService: TeamService, private seoService: StaticSeoService) {
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('TEAM.PAGETITLE', 'TEAM.PAGEDESCRIPTION', ['TEAM', 'IEEE', 'ITBA']);
        this.team$ = this.teamService.getCurrentTeam();
    }
}

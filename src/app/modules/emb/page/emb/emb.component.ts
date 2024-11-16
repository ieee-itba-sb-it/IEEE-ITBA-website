import {Component, OnInit} from '@angular/core';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import {Observable} from 'rxjs';
import {SeoService} from "../../../../core/services/seo/seo.service";

@Component({
    selector: 'app-emb',
    templateUrl: './emb.component.html',
    styleUrls: ['./emb.component.css']
})
export class EmbComponent implements OnInit {

    team$: Observable<Commission> = null;

    constructor( private teamService: TeamService, private seoService: SeoService) {

    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('EMB.PAGETITLE', 'EMB.PAGEDESCRIPTION', ['EMB', 'IEEE', 'ITBA'], 'emb/IEEE_EMBS_logo.png');
        this.team$ = this.teamService.getEmbTeam();
    }

}

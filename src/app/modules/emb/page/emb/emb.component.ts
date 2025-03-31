import {Component, OnInit} from '@angular/core';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import {Observable, zip} from 'rxjs';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-emb',
    templateUrl: './emb.component.html',
    styleUrls: ['./emb.component.css']
})
export class EmbComponent implements OnInit {

    team: Commission = null;

    constructor( private teamService: TeamService, private seoService: StaticSeoService) {

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
        this.seoService.updateMetaTags('EMB.PAGETITLE', 'EMB.PAGEDESCRIPTION', ['EMB', 'IEEE', 'ITBA'], 'emb/IEEE_EMBS_logo.png');
    }

}

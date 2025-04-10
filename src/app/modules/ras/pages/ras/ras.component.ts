import {Component, OnInit} from '@angular/core';
import {Event} from '../../../../shared/models/event/event';
import {EventService} from '../../../../core/services/event/event.service';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import {AppConfigService} from '../../../../core/services/configuration/app-config.service';
import {map, Observable, zip} from 'rxjs';
import {IEEEMember} from "../../../../shared/models/team-member";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-ras',
    templateUrl: './ras.component.html',
    styleUrls: ['./ras.component.css'],
})
export class RasComponent implements OnInit {

    events: Event[] = [];
    loadingEvents: boolean = true;
    team: Commission = null;

    constructor(private eventService: EventService, private teamService: TeamService, private appConfigService: AppConfigService, private seoService: StaticSeoService) {
        zip([
            this.teamService.getCommissionByID("RAS"),
            this.teamService.getMembersByCommission("RAS")
        ]).subscribe(([commission, members]) => {
            this.team = commission;
            this.team.positions.forEach(position => {
                position.members = members.filter(member => member.positionid == position.id);
            });
        })
    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('RAS.PAGETITLE', 'RAS.PAGEDESCRIPTION', ['RAS', 'IEEE', 'ITBA'], 'ras/IEEE_RAS_logo_4C_stacked-HiRes.png');
        this.getRasEvents();
        this.appConfigService.setAppColors({
            background: '#862633',
            underlying: '#C83D59FF',
            hover: '#9E4C67FF'
        });
    }

    getRasEvents(): void {
        this.eventService.getRasEvents()
            .subscribe(events => {
                this.events = events;
                this.loadingEvents = false;
            });
    }
}

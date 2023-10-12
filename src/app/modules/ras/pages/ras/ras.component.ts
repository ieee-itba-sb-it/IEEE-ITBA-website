import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {EventCardData} from '../../../../shared/models/event/event-card-data';
import {EventService} from '../../../../core/services/event/event.service';
import {Commission} from '../../../../shared/models/commission';
import {TeamService} from '../../../../core/services/team/team.service';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { AppConfigService } from '../../../../core/services/configuration/app-config.service';

@Component({
    selector: 'app-ras',
    templateUrl: './ras.component.html',
    styleUrls: ['./ras.component.css'],
})
export class RasComponent implements OnInit {

    events: EventCardData[];
    team: Commission = null;

    constructor(private eventService: EventService, private teamService: TeamService, private appConfigService: AppConfigService) {
    }

    ngOnInit(): void {
        this.events = this.eventService.getRasEvents();
        this.team = this.teamService.getRasTeam();
        this.appConfigService.setNavbarColor('#862633');
        this.appConfigService.setTitle('RAS.PAGETITLE');
    }
}

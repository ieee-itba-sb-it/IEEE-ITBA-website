import { Component, OnInit } from '@angular/core';
import {Event} from '../../../../shared/models/event/event';
import {EventService} from '../../../../core/services/event/event.service';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    events: Event[] = [];
    loadingEvents: boolean = true;

    constructor(private eventService: EventService, private seoService: StaticSeoService) {

    }

    ngOnInit(): void {
        this.seoService.updateMetaTags('EVENTS.PAGETITLE', 'EVENTS.PAGEDESCRIPTION', ['EVENTS', 'IEEE', 'ITBA']);
        this.getEvents();
    }

    getEvents(): void {
        this.eventService.getAllEvents()
            .subscribe(events => {
                this.events = events;
                this.loadingEvents = false;
            });
    }

}

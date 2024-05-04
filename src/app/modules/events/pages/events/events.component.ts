import { Component, OnInit } from '@angular/core';
import {Event} from '../../../../shared/models/event/event';
import {EventService} from '../../../../core/services/event/event.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    events: Event[] = [];
    loadingEvents: boolean = true;

    constructor(private eventService: EventService) {

    }

    ngOnInit(): void {
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

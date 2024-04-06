import { Component, OnInit } from '@angular/core';
import {EventCardData} from '../../../../shared/models/event/event-card-data';
import {EventService} from '../../../../core/services/event/event.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

    events: EventCardData[] = [];

    constructor(private eventService: EventService) {

    }

    ngOnInit(): void {
        this.getEvents();
    }

    getEvents(): void {
        this.eventService.getAllEvents()
            .subscribe(events => this.events = events);
    }

}

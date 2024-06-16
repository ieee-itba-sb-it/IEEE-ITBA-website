import {Component, Input} from '@angular/core';
import {Event, EventDate} from "../../models/event/event";

@Component({
    selector: 'app-event-date-section',
    templateUrl: './event-date-section.component.html',
    styleUrls: ['./event-date-section.component.css']
})
export class EventDateSectionComponent {
    @Input() dates: Event['dates'];
    protected readonly EventDate = EventDate;
}

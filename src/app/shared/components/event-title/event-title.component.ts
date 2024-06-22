import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";

@Component({
    selector: 'app-event-title',
    templateUrl: './event-title.component.html',
    styleUrls: ['./event-title.component.css']
})
export class EventTitleComponent {
    @Input() asimov: boolean = false;
    @Input() dates: Event['dates'];
}


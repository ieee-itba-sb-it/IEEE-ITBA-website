import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus, sortedEventDates} from "../../models/event/event";

@Component({
    selector: 'app-event-date-section',
    templateUrl: './event-date-section.component.html',
    styleUrls: ['./event-date-section.component.css']
})
export class EventDateSectionComponent {
    @Input() dates: Event['dates'];
    protected readonly EventDate = EventDate;

    // Do not show section if there are no valid dates
    isShown(): boolean {
        if (!this.dates) return false;
        return !!Object.keys(EventDate).find((dateType) => this.showEventDate(dateType as EventDate));
    }

    showEventDate(dateType: EventDate): boolean {
        return this.dates[dateType].status !== EventStatus.UNSCHEDULED;
    }

    get eventDates(): EventDate[] {
        return sortedEventDates;
    }
}

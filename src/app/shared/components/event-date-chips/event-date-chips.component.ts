import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {TranslateService} from "@ngx-translate/core";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

@Component({
    selector: 'app-event-date-chips',
    templateUrl: './event-date-chips.component.html',
    styleUrls: ['./event-date-chips.component.css']
})
export class EventDateChipsComponent {

    @Input() dates?: Event['dates'];

    iconClassByEventDate: Record<EventDate, string> = {
        [EventDate.EVENT]:  'fa-bullhorn',
        [EventDate.INSCRIPTION]: 'fa-file-pen',
    }

    constructor(
        private appConfigService: AppConfigService
    ) { }

    get eventDates() {
        return Object.keys(EventDate).filter((eventDate) => this.isShown(eventDate as EventDate)) as EventDate[];
    }

    pipeInput(eventDate: EventDate) {
        return {
            input: this.dates[eventDate],
            eventDate: eventDate,
        };
    }
    isShown(eventDate: EventDate): boolean {
        const date = this.dates[eventDate];
        return date.status !== EventStatus.UNSCHEDULED;
    }

    getIconClass(eventDate: EventDate): string {
        return this.iconClassByEventDate[eventDate];
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }
}

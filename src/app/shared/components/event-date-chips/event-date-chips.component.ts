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
        private translate: TranslateService,
        private appConfigService: AppConfigService
    ) { }

    private locale(): string {
        return this.translate.currentLang;
    }

    private capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private formatConfirmedDate(date: Date): string {
        return date.toLocaleDateString(this.locale(), {timeZone: 'UTC'});
    }

    private formatTentativeDate(month: number): string {
        const fakeDate = new Date(new Date().getFullYear(), month);
        return this.capitalizeFirstLetter(fakeDate.toLocaleDateString(this.locale(), {month: 'long', timeZone: 'UTC'})) + ' ' + fakeDate.getFullYear();
    }

    get eventDates() {
        return Object.keys(EventDate) as EventDate[];
    }

    formatDate(eventDate: EventDate): string {
        const date = this.dates[eventDate];
        switch (date.status) {
        case EventStatus.UNSCHEDULED:
            return this.translate.instant('HOME.EVENTS.STATUS.UNSCHEDULED.DESCRIPTION');
        case EventStatus.UPCOMING:
            return date.year.toLocaleString();
        case EventStatus.TENTATIVE:
            return this.formatTentativeDate(date.month);
        case EventStatus.CONFIRMED:
            return this.formatConfirmedDate(date.date) + (date.isPeriod ? ` - ${this.formatConfirmedDate(date.lastDate)}` : '');
        }
    }

    getIconClass(eventDate: EventDate): string {
        return this.iconClassByEventDate[eventDate];
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }
}

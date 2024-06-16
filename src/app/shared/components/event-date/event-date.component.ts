import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {TranslateService} from "@ngx-translate/core";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";

type Props = {
    iconClass: string,
    i18nKey: string
}

@Component({
    selector: 'app-event-date',
    templateUrl: './event-date.component.html',
    styleUrls: ['./event-date.component.css']
})
export class EventDateComponent {

    @Input() eventDate: EventDate;
    @Input() dates: Event['dates'];
    @Input() isAsimov: boolean = false;

    propsByEventDate: Record<EventDate, Props> = {
        [EventDate.EVENT]: {
            iconClass: 'fa-bullhorn',
            i18nKey: 'HOME.EVENTS.EVENT'
        },
        [EventDate.INSCRIPTION]: {
            iconClass: 'fa-file-pen',
            i18nKey: 'HOME.EVENTS.INSCRIPTION'
        }
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

    formatDate(): string {
        const date = this.dates[this.eventDate];
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

    getIconClass(): string {
        return this.propsByEventDate[this.eventDate].iconClass;
    }

    getTitle(): string {
        return this.translate.instant(this.propsByEventDate[this.eventDate].i18nKey);
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }
}

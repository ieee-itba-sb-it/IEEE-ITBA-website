import {Component, Input} from '@angular/core';
import {Event, EventDate, EventStatus, sortedEventDates} from "../../models/event/event";
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
    @Input() dates?: Event['dates'];
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

    pipeInput() {
        return {
            input: this.dates[this.eventDate],
            eventDate: this.eventDate,
        };
    }

    isShown(): boolean {
        if (!this.dates) return false;
        const date = this.dates[this.eventDate];
        return date.status !== EventStatus.UNSCHEDULED;
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

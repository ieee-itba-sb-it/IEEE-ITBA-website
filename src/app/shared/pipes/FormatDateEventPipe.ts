import {Pipe, PipeTransform} from "@angular/core";
import {ConfirmedDateEvent, EventDate, EventStatus} from "../models/event/event";
import {TranslateService} from "@ngx-translate/core";
import {EventService} from "../../core/services/event/event.service";

type Input = {
    input: ConfirmedDateEvent | { status: EventStatus.TENTATIVE, month: number } | {  status: EventStatus.UPCOMING, year: number } | { status: EventStatus.UNSCHEDULED };
    eventDate: EventDate;
}

@Pipe({ name: "FormatDateEventPipe", pure: false })
export class FormatDateEventPipe implements PipeTransform {
    constructor(private readonly translate: TranslateService, private eventService: EventService) {
    }

    transform({
        input,
        eventDate
    }: Input): string {
        const date = input;
        switch (date.status) {
        case EventStatus.UNSCHEDULED:
            return this.translate.instant('HOME.EVENTS.STATUS.UNSCHEDULED.DESCRIPTION');
        case EventStatus.UPCOMING:
            return String(date.year);
        case EventStatus.TENTATIVE:
            return this.formatTentativeDate(date.month);
        case EventStatus.CONFIRMED:
            const hasEnded = this.eventService.hasEventDateEnded(date);
            if (hasEnded) {
                return this.translate.instant(eventDate === EventDate.INSCRIPTION ?
                    'HOME.EVENTS.STATUS.CONFIRMED.FINISHED_INSCRIPTION' :
                    'HOME.EVENTS.STATUS.CONFIRMED.FINISHED_EVENT');
            }
            return this.formatConfirmedDate(date.date) + (date.isPeriod ? ` - ${this.formatConfirmedDate(date.lastDate)}` : '');
        }
    }

    private formatTentativeDate(month: number): string {
        const fakeDate = new Date(new Date().getFullYear(), month);
        return this.capitalizeFirstLetter(fakeDate.toLocaleDateString(this.locale(), {month: 'long', timeZone: '-03:00'})) + ' ' + fakeDate.getFullYear();
    }

    private capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private formatConfirmedDate(date: Date): string {
        return date.toLocaleDateString(this.locale(), {timeZone: '-03:00', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    }

    private locale(): string {
        return this.translate.currentLang;
    }
}

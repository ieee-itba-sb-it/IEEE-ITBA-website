import {Pipe, PipeTransform} from "@angular/core";
import {ConfirmedDateEvent, EventDate, EventStatus} from "../models/event/event";
import {TranslateService} from "@ngx-translate/core";

type Input = {
    input: ConfirmedDateEvent | { status: EventStatus.TENTATIVE, month: number } | {  status: EventStatus.UPCOMING, year: number } | { status: EventStatus.UNSCHEDULED };
    eventDate: EventDate;
}

@Pipe({ name: "FormatDateEventPipe", pure: false })
export class FormatDateEventPipe implements PipeTransform {
    constructor(private readonly translate: TranslateService) {
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
            const today = new Date();
            const hasEnded = (date.isPeriod ? (date.lastDate < today) : (date.date < today));
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
        return this.capitalizeFirstLetter(fakeDate.toLocaleDateString(this.locale(), {month: 'long', timeZone: 'UTC'})) + ' ' + fakeDate.getFullYear();
    }

    private capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private formatConfirmedDate(date: Date): string {
        return date.toLocaleDateString(this.locale(), {timeZone: 'UTC'});
    }

    private locale(): string {
        return this.translate.currentLang;
    }
}

import {Injectable, OnDestroy} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {TranslateService} from '@ngx-translate/core';
import {parse} from 'date-fns';
import {Subscription} from 'rxjs';

// en-GB displays dates as dd/mm/yyyy, the same format parse() accepts.
const LOCALES: Record<string, string> = {es: 'es-AR', en: 'en-GB'};

@Injectable()
export class BirthDateAdapter extends NativeDateAdapter implements OnDestroy {
    private readonly languageChange: Subscription;

    constructor(translate: TranslateService) {
        super(LOCALES[translate.currentLang] ?? LOCALES['es']);
        this.languageChange = translate.onLangChange.subscribe(({lang}) => this.setLocale(LOCALES[lang] ?? LOCALES['es']));
    }

    override parse(value: unknown): Date | null {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value !== 'string' || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return this.invalid();
        return parse(value, 'dd/MM/yyyy', new Date());
    }

    override getFirstDayOfWeek(): number {
        return 1;
    }

    ngOnDestroy(): void {
        this.languageChange.unsubscribe();
    }
}

@Injectable()
export class BirthDatepickerIntl extends MatDatepickerIntl implements OnDestroy {
    private yearRangeLabel = '';
    private readonly languageChange: Subscription;

    constructor(private translate: TranslateService) {
        super();
        this.languageChange = translate.stream('TEAM_REQUEST.CALENDAR').subscribe(labels => {
            this.calendarLabel = labels.CALENDAR;
            this.openCalendarLabel = labels.OPEN;
            this.closeCalendarLabel = labels.CLOSE;
            this.prevMonthLabel = labels.PREV_MONTH;
            this.nextMonthLabel = labels.NEXT_MONTH;
            this.prevYearLabel = labels.PREV_YEAR;
            this.nextYearLabel = labels.NEXT_YEAR;
            this.prevMultiYearLabel = labels.PREV_YEARS;
            this.nextMultiYearLabel = labels.NEXT_YEARS;
            this.switchToMonthViewLabel = labels.MONTH_VIEW;
            this.switchToMultiYearViewLabel = labels.MULTI_YEAR_VIEW;
            this.yearRangeLabel = labels.YEAR_RANGE;
            this.changes.next();
        });
    }

    override formatYearRangeLabel(start: string, end: string): string {
        return this.translate.parser.interpolate(this.yearRangeLabel, {start, end}) ?? '';
    }

    ngOnDestroy(): void {
        this.languageChange.unsubscribe();
    }
}

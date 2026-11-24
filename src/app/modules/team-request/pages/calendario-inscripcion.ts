import {Injectable, OnDestroy} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {TranslateService} from '@ngx-translate/core';
import {parse} from 'date-fns';
import {Subscription} from 'rxjs';

// en-GB muestra la fecha como dd/mm/aaaa, el mismo formato que acepta parse().
const LOCALES: Record<string, string> = {es: 'es-AR', en: 'en-GB'};

@Injectable()
export class AdaptadorFechaInscripcion extends NativeDateAdapter implements OnDestroy {
    private readonly cambioIdioma: Subscription;

    constructor(traductor: TranslateService) {
        super(LOCALES[traductor.currentLang] ?? LOCALES['es']);
        this.cambioIdioma = traductor.onLangChange.subscribe(({lang}) => this.setLocale(LOCALES[lang] ?? LOCALES['es']));
    }

    override parse(valor: unknown): Date | null {
        if (!valor) return null;
        if (valor instanceof Date) return valor;
        if (typeof valor !== 'string' || !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(valor)) return this.invalid();
        return parse(valor, 'dd/MM/yyyy', new Date());
    }

    override getFirstDayOfWeek(): number {
        return 1;
    }

    ngOnDestroy(): void {
        this.cambioIdioma.unsubscribe();
    }
}

@Injectable()
export class CalendarioInscripcionIntl extends MatDatepickerIntl implements OnDestroy {
    private rangoAnios = '';
    private readonly cambioIdioma: Subscription;

    constructor(private traductor: TranslateService) {
        super();
        this.cambioIdioma = traductor.stream('TEAM_REQUEST.CALENDAR').subscribe(textos => {
            this.calendarLabel = textos.CALENDAR;
            this.openCalendarLabel = textos.OPEN;
            this.closeCalendarLabel = textos.CLOSE;
            this.prevMonthLabel = textos.PREV_MONTH;
            this.nextMonthLabel = textos.NEXT_MONTH;
            this.prevYearLabel = textos.PREV_YEAR;
            this.nextYearLabel = textos.NEXT_YEAR;
            this.prevMultiYearLabel = textos.PREV_YEARS;
            this.nextMultiYearLabel = textos.NEXT_YEARS;
            this.switchToMonthViewLabel = textos.MONTH_VIEW;
            this.switchToMultiYearViewLabel = textos.MULTI_YEAR_VIEW;
            this.rangoAnios = textos.YEAR_RANGE;
            this.changes.next();
        });
    }

    override formatYearRangeLabel(inicio: string, fin: string): string {
        return this.traductor.parser.interpolate(this.rangoAnios, {start: inicio, end: fin}) ?? '';
    }

    ngOnDestroy(): void {
        this.cambioIdioma.unsubscribe();
    }
}

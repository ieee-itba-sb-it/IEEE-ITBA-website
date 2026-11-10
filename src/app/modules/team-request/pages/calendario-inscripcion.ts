import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {parse} from 'date-fns';

@Injectable()
export class AdaptadorFechaInscripcion extends NativeDateAdapter {
    constructor() {
        super('es-AR');
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
}

@Injectable()
export class CalendarioInscripcionIntl extends MatDatepickerIntl {
    override calendarLabel = 'Calendario de fecha de nacimiento';
    override openCalendarLabel = 'Abrir calendario';
    override closeCalendarLabel = 'Cerrar calendario';
    override prevMonthLabel = 'Mes anterior';
    override nextMonthLabel = 'Mes siguiente';
    override prevYearLabel = 'Año anterior';
    override nextYearLabel = 'Año siguiente';
    override prevMultiYearLabel = 'Años anteriores';
    override nextMultiYearLabel = 'Años siguientes';
    override switchToMonthViewLabel = 'Elegir fecha';
    override switchToMultiYearViewLabel = 'Elegir mes y año';

    override formatYearRangeLabel(inicio: string, fin: string): string {
        return `Desde ${inicio} hasta ${fin}`;
    }
}

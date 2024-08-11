import {Event, EventDate, EventStatus} from "../../models/event/event";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";


type FormFields = {
    status: EventStatus;
    date: string | null;
    lastDate: string | null;
    time: string | null;
    isPeriod: boolean;
    month: string | null;
    year: string | null;
}

type FieldsFormControl = {
    [key in keyof FormFields]: FormControl<FormFields[key]>;
}

type FieldsFormGroup = FormGroup<FieldsFormControl>;

export type FormGroupByEventDate = {
    [key in EventDate]: FieldsFormGroup;
}

export class EventDateEditorForm {
    public static readonly DEFAULT_MONTH_VALUE = -1;
    private static readonly DEFAULT_YEAR_VALUE = new Date().getFullYear();
    private static readonly DEFAULT_TIME_VALUE = '00:00';

    private static getIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private static getIsoTime(date: Date): string {
        const time = date.toISOString().split('T')[1].split('.')[0];
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    }

    private static getArgentinaDate(isoDate: string, isoTime: string): Date {
        return new Date(`${isoDate}T${isoTime}:00-03:00`);
    }

    private static validateDateIsNotInThePast(date: AbstractControl<string>, time: AbstractControl<string>, dateKey: string): ValidationErrors | null {
        const argentinaDate = this.getArgentinaDate(date.value, time.value);
        const now = new Date();
        if (argentinaDate < now) {
            return { [dateKey]: { value: argentinaDate.toISOString() } };
        }
        return null;
    }

    private static isConfirmedEventDateValid(control: AbstractControl<FormFields>): ValidationErrors | null {
        const dateValue = control.get('date').value;
        const timeValue = control.get('time').value;
        const isPeriodValue = control.get('isPeriod').value;
        if (dateValue === null) {
            return { dateRequired: { value: dateValue } };
        }
        if (timeValue === null) {
            return { timeRequired: { value: timeValue } };
        }
        if (isPeriodValue) {
            const lastDateValue = control.get('lastDate').value;
            if (lastDateValue === null) {
                return { lastDateRequired: { value: lastDateValue } };
            }
            const lastDateError = this.validateDateIsNotInThePast(control.get('lastDate'), control.get('time'), 'pastLastDate');
            if (lastDateError) {
                return lastDateError;
            }
            if (lastDateValue <= dateValue) {
                return { lastDateBeforeDate: { value: lastDateValue } };
            }
        } else {
            return this.validateDateIsNotInThePast(control.get('date'), control.get('time'),'pastDate');
        }
        return null;
    }

    private static isTentativeEventDateValid(control: AbstractControl<FormFields>): ValidationErrors | null {
        const monthValue = control.get('month').value;
        if (monthValue === null || monthValue === EventDateEditorForm.DEFAULT_MONTH_VALUE.toString()) {
            return { monthRequired: { value: monthValue } };
        }
        const month = parseInt(monthValue, 10);
        const now = new Date();
        if (month < 0 || month > 11) {
            return { invalidMonth: { value: monthValue } };
        }
        if (month < now.getUTCMonth()) {
            return { pastMonth: { value: monthValue } };
        }
        return null;
    }

    private static isUpcomingEventDateValid(control: AbstractControl<FormFields>): ValidationErrors | null {
        const yearValue = control.get('year').value;
        if (yearValue === null) {
            return { yearRequired: { value: yearValue } };
        }
        const year = parseInt(yearValue, 10);
        const now = new Date();
        if (year < now.getUTCFullYear()) {
            return { pastYear: { value: yearValue } };
        }
        return null;
    }

    private static formValidator(): ValidatorFn {
        return (control: AbstractControl<FormFields>): ValidationErrors | null => {
            const status = control.get('status').value;
            switch (status) {
            case EventStatus.CONFIRMED:
                return this.isConfirmedEventDateValid(control);
            case EventStatus.TENTATIVE:
                return this.isTentativeEventDateValid(control);
            case EventStatus.UPCOMING:
                return this.isUpcomingEventDateValid(control);
            default:
                return null;
            }
        }
    }

    private static createEventDateForm(event: Event, eventDate: EventDate): FieldsFormGroup {
        const eventDateData = event.dates[eventDate];
        const initialDate = eventDateData.status === EventStatus.CONFIRMED ? this.getIsoDate(eventDateData.date) : null;
        const initialLastDate = eventDateData.status === EventStatus.CONFIRMED && eventDateData.isPeriod ? this.getIsoDate(eventDateData.lastDate) : null;
        const initialTime = eventDateData.status === EventStatus.CONFIRMED ? this.getIsoTime(eventDateData.date) : this.DEFAULT_TIME_VALUE;
        const initialIsPeriod = eventDateData.status === EventStatus.CONFIRMED && eventDateData.isPeriod;
        const initialMonth = eventDateData.status === EventStatus.TENTATIVE ? eventDateData.month : this.DEFAULT_MONTH_VALUE;
        const initialYear = eventDateData.status === EventStatus.UPCOMING ? eventDateData.year : this.DEFAULT_YEAR_VALUE;
        return new FormGroup<FieldsFormControl>({
            status: new FormControl(eventDateData.status),
            date: new FormControl(initialDate),
            lastDate: new FormControl(initialLastDate),
            time: new FormControl(initialTime),
            isPeriod: new FormControl(initialIsPeriod),
            month: new FormControl(initialMonth.toString()),
            year: new FormControl(initialYear.toString())
        },
        this.formValidator()
        );
    }

    private static createForm(event: Event): FormGroupByEventDate {
        const formGroupByEventDate: Partial<FormGroupByEventDate> = {};
        for (const eventDate of Object.values(EventDate)) {
            formGroupByEventDate[eventDate] = this.createEventDateForm(event, eventDate);
        }
        return formGroupByEventDate as FormGroupByEventDate;
    }

    private static cloneEventDates(event: Event): Event['dates'] {
        const dates: Partial<Event['dates']> = {};
        for (const eventDate of Object.values(EventDate)) {
            const eventDateData = event.dates[eventDate];
            dates[eventDate] = { ...eventDateData };
        }
        return dates as Event['dates'];
    }

    private readonly form: FormGroupByEventDate;
    private readonly initialState: Event['dates'];

    constructor(event: Event) {
        this.form = EventDateEditorForm.createForm(event);
        this.initialState = EventDateEditorForm.cloneEventDates(event);
    }

    getForm(): FormGroupByEventDate {
        return this.form;
    }

    getCurrentState(): Event['dates'] {
        const dates: Partial<Event['dates']> = {};
        for (const eventDate of Object.values(EventDate)) {
            const eventDateForm = this.form[eventDate];
            const status = eventDateForm.get('status').value;
            switch (status) {
            case EventStatus.CONFIRMED:
                dates[eventDate] = {
                    status,
                    date: EventDateEditorForm.getArgentinaDate(eventDateForm.get('date').value, eventDateForm.get('time').value),
                    isPeriod: eventDateForm.get('isPeriod').value,
                    lastDate: eventDateForm.get('isPeriod').value ? EventDateEditorForm.getArgentinaDate(eventDateForm.get('lastDate').value, eventDateForm.get('time').value) : undefined
                };
                break;
            case EventStatus.TENTATIVE:
                dates[eventDate] = {
                    status,
                    month: parseInt(eventDateForm.get('month').value, 10)
                };
                break;
            case EventStatus.UPCOMING:
                dates[eventDate] = {
                    status,
                    year: parseInt(eventDateForm.get('year').value, 10)
                };
                break;
            default:
                dates[eventDate] = { status };
            }
        }
        return dates as Event['dates'];
    }

    setStatus(eventDate: EventDate, status: EventStatus): void {
        this.form[eventDate].get('status').setValue(status);
    }

    isStatus(eventDate: EventDate, status: EventStatus): boolean {
        return this.form[eventDate].get('status').value === status;
    }

    isValid(): boolean {
        return Object.values(EventDate).every(eventDate => {
            const eventDateForm = this.form[eventDate];
            const errors = eventDateForm.errors;
            return !errors || Object.keys(errors).length === 0;
        });
    }

    getError(eventDate: EventDate, errorName: string): ValidationErrors | null {
        const eventDateForm = this.form[eventDate];
        const errors = eventDateForm.errors;
        return (errors && errors[errorName]) || null;
    }

    hasChanged(): boolean {
        const currentState = this.getCurrentState();
        return Object.values(EventDate).some(eventDate => {
            const currentEventDate = currentState[eventDate];
            const currentStatus = currentEventDate.status;
            const initialEventDate = this.initialState[eventDate];
            const initialStatus = initialEventDate.status;
            switch (currentStatus) {
            case EventStatus.UPCOMING:
                return currentStatus !== initialStatus || currentEventDate.year !== initialEventDate.year;
            case EventStatus.TENTATIVE:
                return currentStatus !== initialStatus || currentEventDate.month !== initialEventDate.month;
            case EventStatus.CONFIRMED:
                if (currentStatus !== initialStatus) {
                    return true;
                }
                if (currentEventDate.date.getTime() !== initialEventDate.date.getTime()) {
                    return true;
                }
                if (currentEventDate.isPeriod) {
                    return !initialEventDate.isPeriod || currentEventDate.lastDate.getTime() !== initialEventDate.lastDate.getTime();
                }
                return initialEventDate.isPeriod;
            default:
                return currentStatus !== initialStatus;
            }
        });
    }

    isEventDatePeriodic(eventDate: EventDate): boolean {
        return this.form[eventDate].get('isPeriod').value;
    }
}

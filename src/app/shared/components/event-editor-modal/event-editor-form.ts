import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";

type EventEditorFormDateFields = {
    status: FormControl<EventStatus>;
    date: FormControl<string | null>;
    lastDate: FormControl<string | null>;
    isPeriod: FormControl<boolean>;
    month: FormControl<string | null>;
    year: FormControl<string | null>;
}

type EventDateForm = FormGroup<EventEditorFormDateFields>;

type EventFormGroup = {
    [key in EventDate]: EventDateForm;
};

type EventForm = FormGroup<EventFormGroup>;

export class EventEditorForm {
    public static readonly DEFAULT_MONTH_VALUE = -1;
    private static readonly DEFAULT_YEAR_VALUE = new Date().getFullYear();

    private static getIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private static getToday(): Date {
        return new Date(this.getIsoDate(new Date()));
    }

    private static validateDateIsNotInThePast(control: AbstractControl, dateKey: string): ValidationErrors {
        const date = new Date(control.value);
        const today = this.getToday();
        if (date < today) {
            return { [dateKey]: { value: control.value } };
        }
        return null;
    }

    private static isConfirmedEventDateValid(control: AbstractControl): ValidationErrors {
        const dateValue = control.get('date').value;
        const isPeriodValue = control.get('isPeriod').value;
        if (dateValue === null) {
            return { dateRequired: { value: dateValue } };
        }
        const dateError = this.validateDateIsNotInThePast(control.get('date'), 'pastDate');
        if (dateError) {
            return dateError;
        }
        if (isPeriodValue) {
            const lastDateValue = control.get('lastDate').value;
            if (lastDateValue === null) {
                return { lastDateRequired: { value: lastDateValue } };
            }
            const lastDateError = this.validateDateIsNotInThePast(control.get('lastDate'), 'pastLastDate');
            if (lastDateError) {
                return lastDateError;
            }
            if (lastDateValue <= dateValue) {
                return { lastDateBeforeDate: { value: lastDateValue } };
            }
        }
        return null;
    }

    private static isTentativeEventDateValid(control: AbstractControl): ValidationErrors {
        const monthValue = control.get('month').value;
        if (monthValue === null || monthValue === this.DEFAULT_MONTH_VALUE) {
            return { monthRequired: { value: monthValue } };
        }
        const month = parseInt(monthValue, 10);
        const today = this.getToday();
        if (month < 0 || month > 11) {
            return { invalidMonth: { value: monthValue } };
        }
        if (month < today.getUTCMonth()) {
            return { pastMonth: { value: monthValue } };
        }
        return null;
    }

    private static isUpcomingEventDateValid(control: AbstractControl): ValidationErrors {
        const yearValue = control.get('year').value;
        if (yearValue === null) {
            return { yearRequired: { value: yearValue } };
        }
        const year = parseInt(yearValue, 10);
        const today = this.getToday();
        if (year < today.getUTCFullYear()) {
            return { pastYear: { value: yearValue } };
        }
        return null;
    }

    private static formValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const status = control.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                return this.isConfirmedEventDateValid(control);
            }
            if (status === EventStatus.TENTATIVE) {
                return this.isTentativeEventDateValid(control);
            }
            if (status === EventStatus.UPCOMING) {
                return this.isUpcomingEventDateValid(control);
            }
            return null;
        }
    }

    private static createEventDateForm(event: Event, eventDate: EventDate): EventDateForm {
        const eventDateInfo = event.dates[eventDate];
        const initialDate = eventDateInfo.status === EventStatus.CONFIRMED ? this.getIsoDate(eventDateInfo.date) : null;
        const initialLastDate = eventDateInfo.status === EventStatus.CONFIRMED && eventDateInfo.isPeriod ? this.getIsoDate(eventDateInfo.lastDate) : null;
        const initialIsPeriod = eventDateInfo.status === EventStatus.CONFIRMED && eventDateInfo.isPeriod;
        const initialMonth = eventDateInfo.status === EventStatus.TENTATIVE ? eventDateInfo.month : this.DEFAULT_MONTH_VALUE;
        const initialYear = eventDateInfo.status === EventStatus.UPCOMING ? eventDateInfo.year : this.DEFAULT_YEAR_VALUE;
        return new FormGroup({
            status: new FormControl(event.dates[eventDate].status ?? EventStatus.UNSCHEDULED, Validators.required),
            date: new FormControl(initialDate),
            lastDate: new FormControl(initialLastDate),
            isPeriod: new FormControl(initialIsPeriod),
            month: new FormControl(initialMonth.toString()),
            year: new FormControl(initialYear.toString())
        },
        this.formValidator()
        );
    }

    private static cloneEvent(event: Event): Event {
        const dates: Event["dates"] = {} as Event["dates"];
        for (const eventDate of Object.keys(EventDate)) {
            dates[eventDate] = {
                ...event.dates[eventDate]
            }
        }
        return {
            ...event,
            dates
        }
    }

    private readonly eventForm: EventForm;
    private readonly eventInitialState: Event;

    constructor(event: Event) {
        const eventFormGroup: EventFormGroup = {} as EventFormGroup;
        for (const eventDate of Object.values(EventDate)) {
            eventFormGroup[eventDate] = EventEditorForm.createEventDateForm(event, eventDate);
        }
        this.eventForm = new FormGroup(eventFormGroup);
        this.eventInitialState = EventEditorForm.cloneEvent(event);
    }

    get formGroup(): EventForm {
        return this.eventForm;
    }

    get eventCurrentState(): Event {
        const newEvent = EventEditorForm.cloneEvent(this.eventInitialState);
        for (const eventDate of Object.values(EventDate)) {
            const eventDateForm = this.eventForm.get(eventDate);
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                newEvent.dates[eventDate] = {
                    status,
                    date: new Date(eventDateForm.get('date').value),
                    isPeriod: eventDateForm.get('isPeriod').value,
                    lastDate: eventDateForm.get('isPeriod').value ? new Date(eventDateForm.get('lastDate').value) : undefined
                };
            } else if (status === EventStatus.TENTATIVE) {
                newEvent.dates[eventDate] = {
                    status,
                    month: parseInt(eventDateForm.get('month').value, 10)
                };
            } else if (status === EventStatus.UPCOMING) {
                newEvent.dates[eventDate] = {
                    status,
                    year: parseInt(eventDateForm.get('year').value, 10)
                };
            } else {
                newEvent.dates[eventDate] = {
                    status
                };
            }
        }
        return newEvent;
    }

    setEventDateStatus(eventDate: EventDate, status: EventStatus): void {
        this.eventForm.get(eventDate).get('status').setValue(status);
    }

    isEventDateStatus(eventDate: EventDate, status: EventStatus): boolean {
        return this.eventForm.get(eventDate).get('status').value === status;
    }

    hasFieldError(eventDate: EventDate, controlName: keyof EventEditorFormDateFields, errorName?: string): boolean {
        const control = this.eventForm.get(eventDate).get(controlName);
        if (!errorName) {
            return control.invalid && (control.dirty || control.touched);
        }
        const errors = control.errors;
        return errors && errors[errorName];
    }

    isValid(): boolean {
        return Object.values(EventDate).every(eventDate => {
            const eventDateForm = this.eventForm.get(eventDate);
            const errors = eventDateForm.errors;
            if (errors && Object.keys(errors).length > 0) {
                return false;
            }
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                return !this.hasFieldError(eventDate, 'date') &&
                    !this.hasFieldError(eventDate, 'isPeriod') &&
                    !this.hasFieldError(eventDate, 'lastDate');
            }
            if (status === EventStatus.TENTATIVE) {
                return !this.hasFieldError(eventDate, 'month');
            }
            if (status === EventStatus.UPCOMING) {
                return !this.hasFieldError(eventDate, 'year');
            }
            return true;
        });
    }

    hasError(eventDate: EventDate, errorName?: string): boolean {
        const form = this.eventForm.get(eventDate);
        const errors = form.errors;
        if (!errorName) {
            return !this.isValid();
        }
        return errors && errors[errorName];
    }

    hasChanged(): boolean {
        const currentDates = this.eventCurrentState.dates;
        const initialDates = this.eventInitialState.dates;
        return Object.values(EventDate).some(eventDate => {
            const currentEventDate = currentDates[eventDate];
            const currentStatus = currentEventDate.status;
            const initialEventDate = initialDates[eventDate];
            const initialStatus = initialEventDate.status;
            switch (currentStatus) {
            case EventStatus.UPCOMING:
                return initialStatus !== EventStatus.UPCOMING || initialEventDate.year !== currentEventDate.year;
            case EventStatus.TENTATIVE:
                return initialStatus !== EventStatus.TENTATIVE || initialEventDate.month !== currentEventDate.month;
            case EventStatus.CONFIRMED: {
                if (initialStatus !== EventStatus.CONFIRMED) {
                    return true;
                }
                if (currentEventDate.date.getTime() !== initialEventDate.date.getTime()) {
                    return true;
                }
                if (currentEventDate.isPeriod) {
                    return !initialEventDate.isPeriod || currentEventDate.lastDate.getTime() !== initialEventDate.lastDate.getTime();
                } else {
                    return initialEventDate.isPeriod;
                }
            }
            default:
                return initialEventDate.status !== EventStatus.UNSCHEDULED;
            }
        });
    }

    isEventDateAPeriod(eventDate: EventDate): boolean {
        return this.eventForm.get(eventDate).get('isPeriod').value;
    }

    submit(): Event {
        return this.eventCurrentState;
    }
}

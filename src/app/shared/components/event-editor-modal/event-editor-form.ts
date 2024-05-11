import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event, EventDate, EventStatus} from "../../models/event/event";

type EventEditorFormDateFields = {
    status: FormControl<EventStatus>;
    date: FormControl<string | null>;
    month: FormControl<number | null>;
    year: FormControl<number | null>;
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

    private static nonPastDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const patternError = Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)(control);
            if (patternError) {
                return patternError;
            }
            const date = new Date(control.value);
            const today = this.getToday();
            if (date < today) {
                return { pastDate: { value: control.value } };
            }
            return null;
        }
    }

    private static monthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const patternError = Validators.pattern(/^\d{1,2}$/)(control);
            if (patternError) {
                return patternError;
            }
            const month = parseInt(control.value, 10);
            const today = this.getToday();
            if (month < 0 || month > 11) {
                return { invalidMonth: { value: control.value } };
            }
            if (month < today.getUTCMonth()) {
                return { pastMonth: { value: control.value } };
            }
            return null;
        }
    }

    private static yearValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const patternError = Validators.pattern(/^\d{4}$/)(control);
            if (patternError) {
                return patternError;
            }
            const year = parseInt(control.value, 10);
            const today = this.getToday();
            if (year < today.getUTCFullYear()) {
                return { pastYear: { value: control.value } };
            }
            return null;
        }
    }

    private static requiredIfStatusValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const status = control.get('status').value;
            if (status === EventStatus.CONFIRMED && !control.get('date').value) {
                return { dateRequired: { value: control.get('date').value } };
            }
            if (status === EventStatus.TENTATIVE && control.get('month').value === null) {
                return { monthRequired: { value: control.get('month').value } };
            }
            if (status === EventStatus.UPCOMING && control.get('year').value === null) {
                return { yearRequired: { value: control.get('year').value } };
            }
            return null;
        }
    }

    private static createEventDateForm(event: Event, eventDate: EventDate): EventDateForm {
        const eventDateInfo = event.dates[eventDate];
        const initialDate = eventDateInfo.status === EventStatus.CONFIRMED ? this.getIsoDate(eventDateInfo.date) : null;
        const initialMonth = eventDateInfo.status === EventStatus.TENTATIVE ? eventDateInfo.month : this.DEFAULT_MONTH_VALUE;
        const initialYear = eventDateInfo.status === EventStatus.UPCOMING ? eventDateInfo.year : this.DEFAULT_YEAR_VALUE;
        return new FormGroup({
            status: new FormControl(event.dates[eventDate].status ?? EventStatus.UNSCHEDULED, Validators.required),
            date: new FormControl(initialDate,
                this.nonPastDateValidator()
            ),
            month: new FormControl(initialMonth,
                this.monthValidator()
            ),
            year: new FormControl(initialYear,
                this.yearValidator()
            )
        },
            this.requiredIfStatusValidator()
        );
    }

    private readonly eventForm: EventForm;

    constructor(private event: Event) {
        console.log("event", event)
        const eventFormGroup: EventFormGroup = {} as EventFormGroup;
        for (const eventDate of Object.values(EventDate)) {
            eventFormGroup[eventDate] = EventEditorForm.createEventDateForm(event, eventDate);
        }
        this.eventForm = new FormGroup(eventFormGroup);
    }

    get formGroup(): EventForm {
        return this.eventForm;
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
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                return !this.hasFieldError(eventDate, 'date');
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
            return !this.isValid() && !!errors;
        }
        return errors && errors[errorName];
    }

    hasChanged(): boolean {
        return Object.values(EventDate).some(eventDate => {
            const eventDateForm = this.eventForm.get(eventDate);
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                return eventDateForm.get('date').dirty || eventDateForm.get('date').touched;
            }
            if (status === EventStatus.TENTATIVE) {
                return eventDateForm.get('month').dirty || eventDateForm.get('month').touched;
            }
            return true;
        });
    }

    submit(): Event {
        const newEvent = { ...this.event };
        for (const eventDate of Object.values(EventDate)) {
            const eventDateForm = this.eventForm.get(eventDate);
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                newEvent.dates[eventDate] = {
                    status,
                    date: new Date(eventDateForm.get('date').value)
                };
            } else if (status === EventStatus.TENTATIVE) {
                newEvent.dates[eventDate] = {
                    status,
                    month: eventDateForm.get('month').value
                };
            } else if (status === EventStatus.UPCOMING) {
                newEvent.dates[eventDate] = {
                    status,
                    year: eventDateForm.get('year').value
                };
            } else {
                newEvent.dates[eventDate] = {
                    status
                };
            }
        }
        return newEvent;
    }
}

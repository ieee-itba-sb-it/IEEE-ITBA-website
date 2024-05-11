import {Component, Input, OnInit} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

type EventDateForm = FormGroup<{
    status: FormControl<EventStatus>;
    date: FormControl<string | null>;
    month: FormControl<number | null>;
    year: FormControl<number | null>;
}>;

type EventFormGroup = {
    [key in EventDate]: EventDateForm;
};

type EventForm = FormGroup<EventFormGroup>;

@Component({
    selector: 'app-event-editor-modal',
    templateUrl: './event-editor-modal.component.html',
    styleUrls: ['./event-editor-modal.component.css']
})
export class EventEditorModalComponent implements OnInit {

    @Input() event: Event;
    eventForm: EventForm;
    errorI18n: string = null;
    loading = false;
    defaultMonthValue = -1;
    defaultYearValue = new Date().getFullYear();
    tooltipByEventStatus: Record<EventStatus, boolean> = {
        [EventStatus.CONFIRMED]: false,
        [EventStatus.TENTATIVE]: false,
        [EventStatus.UPCOMING]: false,
        [EventStatus.UNSCHEDULED]: false
    }

    constructor(private eventService: EventService, public modalRef: MDBModalRef) { }

    toggleTooltip(eventStatus: EventStatus) {
        this.tooltipByEventStatus[eventStatus] = !this.tooltipByEventStatus[eventStatus];
    }

    isTooltipVisible(eventStatus: EventStatus): boolean {
        return this.tooltipByEventStatus[eventStatus];
    }

    private getIsoDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    private getToday(): Date {
        return new Date(this.getIsoDate(new Date()));
    }

    private nonPastDateValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const date = new Date(control.value);
            const today = this.getToday();
            if (date < today) {
                return { pastDate: { value: control.value } };
            }
            return null;
        }
    }

    private monthValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const month = parseInt(control.value, 10);
            const today = this.getToday();
            if (month < 0 || month > 11) {
                return { invalidMonth: { value: control.value } };
            }
            if (month < today.getMonth()) {
                return { pastMonth: { value: control.value } };
            }
            return null;
        }
    }

    private yearValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const year = parseInt(control.value, 10);
            const today = this.getToday();
            if (year < today.getFullYear()) {
                return { pastYear: { value: control.value } };
            }
            return null;
        }
    }

    private requiredIfStatus(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const status = control.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                return { dateRequired: { value: control.get('date').value } };
            }
            if (status === EventStatus.TENTATIVE) {
                return { monthRequired: { value: control.get('month').value } };
            }
            if (status === EventStatus.UPCOMING) {
                return { yearRequired: { value: control.get('year').value } };
            }
            return null;
        }
    }

    private createEventDateForm(eventDate: EventDate): EventDateForm {
        const eventDateInfo = this.event.dates[eventDate];
        const initialDate = eventDateInfo.status === EventStatus.CONFIRMED ? this.getIsoDate(eventDateInfo.date) : null;
        const initialMonth = eventDateInfo.status === EventStatus.TENTATIVE ? eventDateInfo.month : this.defaultMonthValue;
        const initialYear = eventDateInfo.status === EventStatus.UPCOMING ? eventDateInfo.year : this.defaultYearValue;
        return new FormGroup({
            status: new FormControl(this.event.dates[eventDate].status ?? EventStatus.UNSCHEDULED, Validators.required),
            date: new FormControl(initialDate,
                [
                    Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
                    this.nonPastDateValidator()
                ]
            ),
            month: new FormControl(initialMonth,
                [
                    Validators.pattern(/^\d{2}$/),
                    this.monthValidator()
                ]
            ),
            year: new FormControl(initialYear,
                [
                    Validators.pattern(/^\d{4}$/),
                    this.yearValidator()
                ]
            )
        }, [
            this.requiredIfStatus()
        ]);
    }

    private createEventForm(): EventForm {
        const eventFormGroup: EventFormGroup = {} as EventFormGroup;
        for (const eventDate of Object.values(EventDate)) {
            eventFormGroup[eventDate] = this.createEventDateForm(eventDate);
        }
        return new FormGroup(eventFormGroup);
    }

    ngOnInit(): void {
        this.eventForm = this.createEventForm();
    }

    get months(): number[] {
        return Array.from(Array(12).keys());
    }

    get eventDates(): EventDate[] {
        return Object.values(EventDate);
    }

    get eventStatuses(): EventStatus[] {
        return Object.values(EventStatus);
    }

    setEventDateStatus(eventDate: EventDate, status: EventStatus) {
        this.eventForm.get(eventDate).get('status').setValue(status);
    }

    isEventDateStatus(eventDate: EventDate, status: EventStatus): boolean {
        return this.eventForm.get(eventDate).get('status').value === status;
    }

    isEventDateConfirmed(eventDate: EventDate): boolean {
        return this.isEventDateStatus(eventDate, EventStatus.CONFIRMED);
    }

    isEventDateTentative(eventDate: EventDate): boolean {
        return this.isEventDateStatus(eventDate, EventStatus.TENTATIVE);
    }

    isEventDateUpcoming(eventDate: EventDate): boolean {
        return this.isEventDateStatus(eventDate, EventStatus.UPCOMING);
    }

    async updateEvent() {
        if (this.eventForm.invalid) {
            return;
        }
        const newEvent: Event = {
            ...this.event,
        };
        for (const eventDate of this.eventDates) {
            const eventDateForm = this.eventForm.get(eventDate);
            const status = eventDateForm.get('status').value;
            if (status === EventStatus.CONFIRMED) {
                newEvent.dates[eventDate] = {
                    status: EventStatus.CONFIRMED,
                    date: new Date(eventDateForm.get('date').value)
                };
            } else if (status === EventStatus.TENTATIVE) {
                newEvent.dates[eventDate] = {
                    status: EventStatus.TENTATIVE,
                    month: eventDateForm.get('month').value
                };
            } else if (status === EventStatus.UPCOMING) {
                newEvent.dates[eventDate] = {
                    status: EventStatus.UPCOMING,
                    year: eventDateForm.get('year').value
                };
            } else {
                newEvent.dates[eventDate] = {
                    status: EventStatus.UNSCHEDULED
                };
            }
        }
        this.loading = true;
        const updated = await this.eventService.updateEvent(newEvent);
        if (updated) {
            this.errorI18n = null;
            this.modalRef.hide();
        } else {
            this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.UPDATE';
        }
        this.loading = false;
        this.event = newEvent;
    }

}

import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Event, EventDate, EventStatus, sortedEventDates} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";
import {EventEditorForm} from "./event-editor-form";

@Component({
    selector: 'app-event-editor-modal',
    templateUrl: './event-editor-modal.component.html',
    styleUrls: ['./event-editor-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class EventEditorModalComponent implements OnInit {

    @Input() event: Event;
    @Output() updateEmitter: EventEmitter<Event> = new EventEmitter();

    form: EventEditorForm;
    errorI18n: string = null;
    loading = false;
    tooltipByEventStatus: Record<EventStatus, boolean> = {
        [EventStatus.CONFIRMED]: false,
        [EventStatus.TENTATIVE]: false,
        [EventStatus.UPCOMING]: false,
        [EventStatus.UNSCHEDULED]: false
    };
    i18nErrorByFormErrorName: Record<string, string> = {
        dateRequired: 'DATE_REQUIRED',
        pastDate: 'DATE_PAST',
        lastDateRequired: 'LAST_DATE_REQUIRED',
        pastLastDate: 'LAST_DATE_PAST',
        lastDateBeforeDate: 'LAST_DATE_BEFORE_DATE',
        monthRequired: 'MONTH_REQUIRED',
        invalidMonth: 'MONTH_INVALID',
        pastMonth: 'MONTH_PAST',
        yearRequired: 'YEAR_REQUIRED',
        pastYear: 'YEAR_PAST'
    }

    constructor(private eventService: EventService, public modalRef: MDBModalRef, private appConfigService: AppConfigService) { }

    ngOnInit() {
        this.form = new EventEditorForm(this.event);
    }

    toggleTooltip(eventStatus: EventStatus) {
        this.tooltipByEventStatus[eventStatus] = !this.tooltipByEventStatus[eventStatus];
    }

    isTooltipVisible(eventStatus: EventStatus): boolean {
        return this.tooltipByEventStatus[eventStatus];
    }

    get months(): number[] {
        return Array.from(Array(12).keys());
    }

    get eventDates(): EventDate[] {
        return sortedEventDates;
    }

    get eventStatuses(): EventStatus[] {
        return Object.values(EventStatus);
    }

    get defaultMonthValue(): number {
        return EventEditorForm.DEFAULT_MONTH_VALUE;
    }

    setEventDateStatus: EventEditorForm['setEventDateStatus'] = (eventDate, status) => {
        this.form.setEventDateStatus(eventDate, status);
    }

    isEventDateStatus: EventEditorForm['isEventDateStatus'] = (eventDate, status) => {
        return this.form.isEventDateStatus(eventDate, status);
    }

    isEventDateConfirmed(eventDate: EventDate): boolean {
        return this.form.isEventDateStatus(eventDate, EventStatus.CONFIRMED);
    }

    isEventDateTentative(eventDate: EventDate): boolean {
        return this.form.isEventDateStatus(eventDate, EventStatus.TENTATIVE);
    }

    isEventDateUpcoming(eventDate: EventDate): boolean {
        return this.form.isEventDateStatus(eventDate, EventStatus.UPCOMING);
    }

    getAppColors() {
        return this.appConfigService.getAppColors();
    }

    isFormValid(): boolean {
        return this.form.isValid();
    }

    hasFormError(eventDate: EventDate, errorName?: string): boolean {
        return this.form.hasError(eventDate, errorName);
    }

    getFormErrorsI18n(eventDate: EventDate): string[] {
        return Object.keys(this.i18nErrorByFormErrorName)
            .filter(errorName => this.hasFormError(eventDate, errorName))
            .map(errorName => this.i18nErrorByFormErrorName[errorName])
            .map(i18nKey => `HOME.EVENTS.EDIT.ERROR.${i18nKey}`)
    }

    hasFormChanged(): boolean {
        return this.form.hasChanged()
    }

    isEventDateAPeriod(eventDate: EventDate): boolean {
        return this.form.isEventDateAPeriod(eventDate);
    }

    async updateEvent() {
        if (!this.isFormValid()) {
            return;
        }
        const newEvent = this.form.submit();
        this.loading = true;
        this.eventService.updateEvent(newEvent).subscribe((updated) => {
            this.loading = false;
            if (updated) {
                this.updateEmitter.emit(newEvent);
                this.errorI18n = null;
                this.modalRef.hide();
            } else {
                this.errorI18n = 'HOME.EVENTS.EDIT.ERROR.UPDATE';
            }
        })
    }
}

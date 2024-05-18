import {Component, Input, OnInit} from '@angular/core';
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";
import {EventEditorForm} from "./event-editor-form";

@Component({
    selector: 'app-event-editor-modal',
    templateUrl: './event-editor-modal.component.html',
    styleUrls: ['./event-editor-modal.component.css']
})
export class EventEditorModalComponent implements OnInit {

    @Input() event: Event;
    form: EventEditorForm;
    errorI18n: string = null;
    loading = false;
    tooltipByEventStatus: Record<EventStatus, boolean> = {
        [EventStatus.CONFIRMED]: false,
        [EventStatus.TENTATIVE]: false,
        [EventStatus.UPCOMING]: false,
        [EventStatus.UNSCHEDULED]: false
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
        return Object.values(EventDate);
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

    hasFieldError: EventEditorForm['hasFieldError'] = (eventDate, controlName, errorName) => {
        return this.form.hasFieldError(eventDate, controlName, errorName);
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

    hasFormChanged(): boolean {
        return this.form.hasChanged();
    }

    async updateEvent() {
        if (!this.isFormValid()) {
            return;
        }
        const newEvent = this.form.submit();
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

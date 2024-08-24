import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Event, EventDate, EventStatus, sortedEventDates} from "../../models/event/event";
import {EventService} from "../../../core/services/event/event.service";
import {MDBModalRef} from "angular-bootstrap-md";
import {AppConfigService} from "../../../core/services/configuration/app-config.service";
import {EventEditorForm} from "./event-editor-form";
import {TranslateService} from "@ngx-translate/core";
import {InscriptionLinkEventEditorForm} from "./event-editor-form-inscription-link";
import {EventDateEventEditorForm} from "./event-editor-form-date";

type I18nParams = Record<string, string>;

type I18nElements = {
    key: string;
    params?: I18nParams;
}

type I18nErrorByFormErrorName = Record<string, I18nElements>;

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
    i18nEventDateErrorByFormErrorName: I18nErrorByFormErrorName = {
        timeRequired: {
            key: 'TIME_REQUIRED'
        },
        dateRequired: {
            key: 'DATE_REQUIRED'
        },
        pastDate: {
            key: 'DATE_PAST'
        },
        lastTimeRequired: {
            key: 'LAST_TIME_REQUIRED'
        },
        lastDateRequired: {
            key: 'LAST_DATE_REQUIRED'
        },
        pastLastDate: {
            key: 'LAST_DATE_PAST'
        },
        lastDateBeforeDate: {
            key: 'LAST_DATE_BEFORE_DATE'
        },
        monthRequired: {
            key: 'MONTH_REQUIRED'
        },
        invalidMonth: {
            key: 'MONTH_INVALID'
        },
        pastMonth: {
            key: 'MONTH_PAST'
        },
        yearRequired: {
            key: 'YEAR_REQUIRED'
        },
        pastYear: {
            key: 'YEAR_PAST'
        }
    }
    i18nInscriptionLinkErrorByFormErrorName: I18nErrorByFormErrorName = {
        inscriptionLinkMaxLength: {
            key: 'INSCRIPTION_LINK_MAX_LENGTH',
            params: {max: InscriptionLinkEventEditorForm.INSCRIPTION_LINK_MAX_LENGTH.toString()}
        },
    }

    constructor(
        private eventService: EventService,
        public modalRef: MDBModalRef,
        private appConfigService: AppConfigService,
        private translateService: TranslateService
    ) { }

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
        return EventDateEventEditorForm.DEFAULT_MONTH_VALUE;
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

    private getFormErrors(
        i18nErrorByFormErrorName: I18nErrorByFormErrorName,
        getError: (errorName: string) => I18nParams | null,
    ): string[] {
        return Object.keys(i18nErrorByFormErrorName)
            .map<[string, I18nParams | null]>((errorName) => [errorName, getError(errorName)])
            .filter(([errorName, error]) => error !== null)
            .map<[I18nElements, I18nParams]>((([errorName, error]) => [i18nErrorByFormErrorName[errorName], error]))
            .map(([i18nElements, dynamicParams]) => {
                return this.translateService.instant(`HOME.EVENTS.EDIT.ERROR.${i18nElements.key}`, {
                    ...(i18nElements.params ?? {}),
                    ...dynamicParams
                });
            });
    }

    getFormEventDateErrors(eventDate: EventDate): string[] {
        return this.getFormErrors(
            this.i18nEventDateErrorByFormErrorName,
            errorName => this.form.getEventDateError(eventDate, errorName),
        );
    }

    get hasFormEventDateErrors(): boolean {
        return this.eventDates.some(eventDate => this.getFormEventDateErrors(eventDate).length > 0);
    }

    getFormInscriptionLinkErrors(): string[] {
        return this.getFormErrors(
            this.i18nInscriptionLinkErrorByFormErrorName,
            errorName => this.form.getInscriptionLinkError(errorName),
        );
    }

    get hasFormInscriptionLinkErrors(): boolean {
        return this.getFormInscriptionLinkErrors().length > 0;
    }

    hasFormChanged(): boolean {
        return this.form.hasChanged()
    }

    isEventDateAPeriod(eventDate: EventDate): boolean {
        return this.form.isEventDateAPeriod(eventDate);
    }

    clearInscriptionLink() {
        this.form.clearInscriptionLink();
    }

    isInscriptionLinkEmpty(): boolean {
        return this.form.isInscriptionLinkEmpty();
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

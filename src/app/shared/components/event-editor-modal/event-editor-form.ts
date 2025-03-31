import {FormGroup, ValidationErrors} from "@angular/forms";
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventDateEventEditorForm, EventDateEventForm} from "./event-editor-form-date";
import {InscriptionLinkEventEditorForm, InscriptionLinkEventForm} from "./event-editor-form-inscription-link";

type EventFormGroup = EventDateEventForm & InscriptionLinkEventForm;

type EventForm = FormGroup<EventFormGroup>;

export class EventEditorForm {

    private static cloneEvent(event: Event): Event {
        const dates: Event["dates"] = {} as Event["dates"];
        for (const eventDate of Object.keys(EventDate)) {
            dates[eventDate] = {
                ...event.dates[eventDate]
            }
        }
        return {
            ...event,
            dates,
        }
    }

    private readonly eventForm: EventForm;
    private readonly eventInitialState: Event;
    private readonly eventDateEventEditorForm: EventDateEventEditorForm;
    private readonly inscriptionLinkEventEditorForm: InscriptionLinkEventEditorForm;

    constructor(event: Event) {
        this.eventInitialState = EventEditorForm.cloneEvent(event);
        this.eventDateEventEditorForm = new EventDateEventEditorForm(event);
        this.inscriptionLinkEventEditorForm = new InscriptionLinkEventEditorForm(event);
        const eventDateFormGroup: EventDateEventForm = this.eventDateEventEditorForm.getForm();
        const inscriptionLinkFormGroup: InscriptionLinkEventForm = this.inscriptionLinkEventEditorForm.getForm();
        this.eventForm = new FormGroup({
            ...eventDateFormGroup,
            ...inscriptionLinkFormGroup
        });
    }

    get formGroup(): EventForm {
        return this.eventForm;
    }

    get eventCurrentState(): Event {
        const newEvent = EventEditorForm.cloneEvent(this.eventInitialState);
        const newEventDates = this.eventDateEventEditorForm.getCurrentState();
        const newInscriptionLink = this.inscriptionLinkEventEditorForm.getCurrentState();
        return {
            ...newEvent,
            dates: newEventDates,
            inscriptionLink: newInscriptionLink
        };
    }

    setEventDateStatus(eventDate: EventDate, status: EventStatus): void {
        this.eventDateEventEditorForm.setStatus(eventDate, status);
    }

    isEventDateStatus(eventDate: EventDate, status: EventStatus): boolean {
        return this.eventDateEventEditorForm.isStatus(eventDate, status);
    }

    isValid(): boolean {
        const areEventDatesValid = this.eventDateEventEditorForm.isValid();
        const isEventInscriptionLinkValid = this.inscriptionLinkEventEditorForm.isValid();
        return areEventDatesValid && isEventInscriptionLinkValid;
    }

    getEventDateError(eventDate: EventDate, errorName: string): ValidationErrors | null {
        return this.eventDateEventEditorForm.getError(eventDate, errorName);
    }

    getInscriptionLinkError(errorName: string): ValidationErrors | null {
        return this.inscriptionLinkEventEditorForm.getError(errorName);
    }

    private hasEventDatesChanged(): boolean {
        return this.eventDateEventEditorForm.hasChanged();
    }

    private hasInscriptionLinkChanged(): boolean {
        return this.inscriptionLinkEventEditorForm.hasChanged();
    }

    hasChanged(): boolean {
        return this.hasEventDatesChanged() || this.hasInscriptionLinkChanged();
    }

    isEventDateAPeriod(eventDate: EventDate): boolean {
        return this.eventDateEventEditorForm.isEventDatePeriodic(eventDate);
    }

    clearInscriptionLink(): void {
        this.inscriptionLinkEventEditorForm.clear();
    }

    isInscriptionLinkEmpty(): boolean {
        return this.inscriptionLinkEventEditorForm.isEmpty();
    }

    submit(): Event {
        return this.eventCurrentState;
    }
}

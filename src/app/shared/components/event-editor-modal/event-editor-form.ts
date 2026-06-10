import {FormGroup, ValidationErrors} from "@angular/forms";
import {Event, EventDate, EventStatus} from "../../models/event/event";
import {EventDateEventEditorForm, EventDateEventForm} from "./event-editor-form-date";
import {InscriptionLinkEventEditorForm, InscriptionLinkEventForm} from "./event-editor-form-inscription-link";
import {LocationEventEditorForm, LocationEventForm} from "./event-editor-form-location";

type EventFormGroup = EventDateEventForm & InscriptionLinkEventForm & LocationEventForm;

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
    private readonly locationEventEditorForm: LocationEventEditorForm;

    constructor(event: Event) {
        this.eventInitialState = EventEditorForm.cloneEvent(event);
        this.eventDateEventEditorForm = new EventDateEventEditorForm(event);
        this.inscriptionLinkEventEditorForm = new InscriptionLinkEventEditorForm(event);
        this.locationEventEditorForm = new LocationEventEditorForm(event);
        const eventDateFormGroup: EventDateEventForm = this.eventDateEventEditorForm.getForm();
        const inscriptionLinkFormGroup: InscriptionLinkEventForm = this.inscriptionLinkEventEditorForm.getForm();
        const locationFormGroup: LocationEventForm = this.locationEventEditorForm.getForm();
        this.eventForm = new FormGroup({
            ...eventDateFormGroup,
            ...inscriptionLinkFormGroup,
            ...locationFormGroup
        });
    }

    get formGroup(): EventForm {
        return this.eventForm;
    }

    get eventCurrentState(): Event {
        const newEvent = EventEditorForm.cloneEvent(this.eventInitialState);
        const newEventDates = this.eventDateEventEditorForm.getCurrentState();
        const newInscriptionLink = this.inscriptionLinkEventEditorForm.getCurrentInscriptionLink();
        const newSpectatorEnabled = this.inscriptionLinkEventEditorForm.getCurrentSpectatorEnabled();
        const newSpectatorLink = this.inscriptionLinkEventEditorForm.getCurrentSpectatorLink();
        const newLocationEvent = this.locationEventEditorForm.getCurrentState();
        return {
            ...newEvent,
            dates: newEventDates,
            inscriptionLink: newInscriptionLink,
            spectatorInscriptionEnabled: newSpectatorEnabled,
            spectatorInscriptionLink: newSpectatorLink,
            location: newLocationEvent.location,
            locationLink: newLocationEvent.locationLink
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
        const isLocationValid = this.locationEventEditorForm.isValid()
        return areEventDatesValid && isEventInscriptionLinkValid && isLocationValid;
    }

    getEventDateError(eventDate: EventDate, errorName: string): ValidationErrors | null {
        return this.eventDateEventEditorForm.getError(eventDate, errorName);
    }

    getInscriptionLinkError(errorName: string): ValidationErrors | null {
        return this.inscriptionLinkEventEditorForm.getError(errorName);
    }

    getSpectatorInscriptionLinkError(errorName: string): ValidationErrors | null {
        return this.inscriptionLinkEventEditorForm.getSpectatorLinkError(errorName);
    }

    private hasEventDatesChanged(): boolean {
        return this.eventDateEventEditorForm.hasChanged();
    }

    private hasInscriptionLinkChanged(): boolean {
        return this.inscriptionLinkEventEditorForm.hasChanged();
    }

    private hasLocationChanged(): boolean {
        return this.locationEventEditorForm.hasChanged();
    }

    hasChanged(): boolean {
        return this.hasEventDatesChanged() || this.hasInscriptionLinkChanged() || this.hasLocationChanged();
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

    isSpectatorInscriptionEnabled(): boolean {
        return this.inscriptionLinkEventEditorForm.getCurrentSpectatorEnabled();
    }

    clearSpectatorInscriptionLink(): void {
        this.inscriptionLinkEventEditorForm.clearSpectatorLink();
    }

    isSpectatorInscriptionLinkEmpty(): boolean {
        return this.inscriptionLinkEventEditorForm.isSpectatorLinkEmpty();
    }

    submit(): Event {
        return this.eventCurrentState;
    }
}

import {FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {Event, EventDate, EventStatus, IeeeEvent} from "../../models/event/event";
import {EventDateEventEditorForm, EventDateEventForm} from "./event-editor-form-date";
import {InscriptionLinkEventEditorForm, InscriptionLinkEventForm} from "./event-editor-form-inscription-link";
import {LocationEventEditorForm, LocationEventForm} from "./event-editor-form-location";
import {DataAnalysisEventEditorForm} from "./event-editor-form-data-analysis";

type EventFormGroup = EventDateEventForm & InscriptionLinkEventForm &
    LocationEventForm & Partial<DataAnalysisEventForm>;

type EventForm = FormGroup<EventFormGroup>;
type DataAnalysisEventForm = {
    passingScore: FormControl<number>;
    examStartDate: FormControl<Date | null>;
};

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
    private readonly dataAnalysisEventEditorForm?: DataAnalysisEventEditorForm;

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
        if (event.id === IeeeEvent.DATA_ANALYSIS) {
            this.dataAnalysisEventEditorForm = new DataAnalysisEventEditorForm(event);
            this.eventForm.addControl("passingScore", this.dataAnalysisEventEditorForm.getForm().passingScore);
            this.eventForm.addControl("examStartDate", this.dataAnalysisEventEditorForm.getForm().examStartDate);
        }
    }

    get formGroup(): EventForm {
        return this.eventForm;
    }

    get eventCurrentState(): Event {
        const newEvent = EventEditorForm.cloneEvent(this.eventInitialState);
        const newEventDates = this.eventDateEventEditorForm.getCurrentState();
        const newInscriptionLink = this.inscriptionLinkEventEditorForm.getCurrentState();
        const newLocationEvent = this.locationEventEditorForm.getCurrentState();
        return {
            ...newEvent,
            dates: newEventDates,
            inscriptionLink: newInscriptionLink,
            location: newLocationEvent.location,
            locationLink: newLocationEvent.locationLink,
            ...this.dataAnalysisEventEditorForm?.getCurrentState(),
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
        const isDataAnalysisValid = this.dataAnalysisEventEditorForm?.isValid() ?? true;
        return areEventDatesValid &&
            isEventInscriptionLinkValid &&
            isLocationValid &&
            isDataAnalysisValid;
    }

    getEventDateError(eventDate: EventDate, errorName: string): ValidationErrors | null {
        return this.eventDateEventEditorForm.getError(eventDate, errorName);
    }

    getInscriptionLinkError(errorName: string): ValidationErrors | null {
        return this.inscriptionLinkEventEditorForm.getError(errorName);
    }

    getDataAnalysisError(error:string): ValidationErrors | null {
        return this.dataAnalysisEventEditorForm?.getError(error) ?? null;
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

    private hasDataAnalysisChanged(): boolean {
        return this.dataAnalysisEventEditorForm?.hasChanged() ?? false;
    }

    hasChanged(): boolean {
        return this.hasEventDatesChanged() || this.hasInscriptionLinkChanged() ||
            this.hasLocationChanged() || this.hasDataAnalysisChanged();
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

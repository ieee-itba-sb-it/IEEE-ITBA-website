import {AbstractControl, FormControl, ValidationErrors} from "@angular/forms";
import {Event} from "../../models/event/event";

type InscriptionLinkForm = {
    inscriptionLink: FormControl<string | null>;
}

export class EventInscriptionLinkEditorForm {
    private readonly initialState: string | null;
    private readonly form: InscriptionLinkForm;
    public static readonly INSCRIPTION_LINK_MAX_LENGTH = 255;

    private static isValid(control: AbstractControl<string | null>): ValidationErrors | null {
        const value = control.value?.trim() ?? null;
        if (value !== null && value.length > EventInscriptionLinkEditorForm.INSCRIPTION_LINK_MAX_LENGTH) {
            return { inscriptionLinkMaxLength: { length: value.length } };
        }
        return null;
    }

    constructor(event: Event) {
        this.initialState = event.inscriptionLink;
        this.form = {
            inscriptionLink: new FormControl(event.inscriptionLink, EventInscriptionLinkEditorForm.isValid)
        }
    }

    getCurrentState(): string | null {
        return this.form.inscriptionLink.value;
    }

    isValid(): boolean {
        const control = this.form.inscriptionLink;
        const errors = control.errors;
        return !errors || Object.keys(errors).length === 0;
    }

    getError(errorName: string): ValidationErrors | null {
        const control = this.form.inscriptionLink;
        const errors = control.errors;
        return (errors && errors[errorName]) ?? null;
    }

    hasChanged(): boolean {
        return this.initialState !== this.getCurrentState();
    }

    clear(): void {
        this.form.inscriptionLink.setValue(null);
    }

    isEmpty(): boolean {
        const value = this.form.inscriptionLink.value;
        return value === null || value.trim().length === 0;
    }
}

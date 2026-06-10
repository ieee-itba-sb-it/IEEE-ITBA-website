import {AbstractControl, FormControl, ValidationErrors} from "@angular/forms";
import {Event} from "../../models/event/event";

export type InscriptionLinkEventForm = {
    inscriptionLink: FormControl<string | null>;
    spectatorInscriptionEnabled: FormControl<boolean>;
    spectatorInscriptionLink: FormControl<string | null>;
}

export class InscriptionLinkEventEditorForm {
    private readonly initialInscriptionLink: string | null;
    private readonly initialSpectatorEnabled: boolean;
    private readonly initialSpectatorLink: string | null;
    private readonly form: InscriptionLinkEventForm;
    public static readonly INSCRIPTION_LINK_MAX_LENGTH = 255;

    private static isValid(control: AbstractControl<string | null>): ValidationErrors | null {
        const value = control.value?.trim() ?? null;
        if (value !== null && value.length > InscriptionLinkEventEditorForm.INSCRIPTION_LINK_MAX_LENGTH) {
            return { inscriptionLinkMaxLength: { length: value.length } };
        }
        return null;
    }

    constructor(event: Event) {
        this.initialInscriptionLink = event.inscriptionLink;
        this.initialSpectatorEnabled = event.spectatorInscriptionEnabled ?? false;
        this.initialSpectatorLink = event.spectatorInscriptionLink ?? null;
        this.form = {
            inscriptionLink: new FormControl(event.inscriptionLink, InscriptionLinkEventEditorForm.isValid),
            spectatorInscriptionEnabled: new FormControl(this.initialSpectatorEnabled),
            spectatorInscriptionLink: new FormControl(this.initialSpectatorLink, InscriptionLinkEventEditorForm.isValid),
        }

        this.form.spectatorInscriptionEnabled.valueChanges.subscribe((enabled) => {
            if (!enabled) {
                this.form.spectatorInscriptionLink.setValue(null);
            }
        });
    }

    getForm(): InscriptionLinkEventForm {
        return this.form;
    }

    getCurrentInscriptionLink(): string | null {
        return this.form.inscriptionLink.value;
    }

    getCurrentSpectatorEnabled(): boolean {
        return this.form.spectatorInscriptionEnabled.value;
    }

    getCurrentSpectatorLink(): string | null {
        if (!this.getCurrentSpectatorEnabled()) {
            return null;
        }
        return this.form.spectatorInscriptionLink.value;
    }

    isValid(): boolean {
        const inscriptionErrors = this.form.inscriptionLink.errors;
        const inscriptionValid = !inscriptionErrors || Object.keys(inscriptionErrors).length === 0;

        if (!this.getCurrentSpectatorEnabled()) {
            return inscriptionValid;
        }

        const spectatorErrors = this.form.spectatorInscriptionLink.errors;
        const spectatorValid = !spectatorErrors || Object.keys(spectatorErrors).length === 0;

        return inscriptionValid && spectatorValid;
    }

    getError(errorName: string): ValidationErrors | null {
        const control = this.form.inscriptionLink;
        const errors = control.errors;
        return (errors && errors[errorName]) ?? null;
    }

    getSpectatorLinkError(errorName: string): ValidationErrors | null {
        const control = this.form.spectatorInscriptionLink;
        const errors = control.errors;
        return (errors && errors[errorName]) ?? null;
    }

    hasChanged(): boolean {
        return this.initialInscriptionLink !== this.getCurrentInscriptionLink()
            || this.initialSpectatorEnabled !== this.getCurrentSpectatorEnabled()
            || this.initialSpectatorLink !== this.getCurrentSpectatorLink();
    }

    clear(): void {
        this.form.inscriptionLink.setValue(null);
    }

    clearSpectatorLink(): void {
        this.form.spectatorInscriptionLink.setValue(null);
    }

    isEmpty(): boolean {
        const value = this.form.inscriptionLink.value;
        return value === null || value.trim().length === 0;
    }

    isSpectatorLinkEmpty(): boolean {
        const value = this.form.spectatorInscriptionLink.value;
        return value === null || value.trim().length === 0;
    }
}

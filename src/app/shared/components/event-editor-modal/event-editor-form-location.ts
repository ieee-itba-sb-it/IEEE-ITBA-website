import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Event } from '../../models/event/event';

export type LocationEventForm = {
    location: FormControl<string | null>;
    locationLink: FormControl<string | null>;
    locationConfirmed: FormControl<boolean>;
};

export class LocationEventEditorForm {
    private readonly initialName: string;
    private readonly initialUrl: string;
    private readonly form: LocationEventForm;
    public static readonly LOCATION_NAME_MAX_LENGTH = 255;
    public static readonly LOCATION_URL_MAX_LENGTH = 255;

    constructor(event: Event) {
        this.initialName = (event.location ?? '').trim();
        this.initialUrl = (event.locationLink ?? '').trim();

        this.form = {
            location: new FormControl(this.initialName, LocationEventEditorForm.nameValidator),
            locationLink: new FormControl(this.initialUrl, LocationEventEditorForm.urlValidator),
            locationConfirmed: new FormControl(this.initialName.length > 0 && this.initialUrl.length > 0)
        };

        this.form.locationConfirmed.valueChanges.subscribe((confirmed) => {
            if (!confirmed) {
                this.form.location.setValue('');
                this.form.locationLink.setValue('');
            }
        });
    }

    static nameValidator(control: AbstractControl<string | null>): ValidationErrors | null {
        const value = control.value?.trim();
        if (value && value.length > LocationEventEditorForm.LOCATION_NAME_MAX_LENGTH) {
            return { locationNameMaxLength: { length: value.length } };
        }
        return null;
    }

    static urlValidator(control: AbstractControl<string | null>): ValidationErrors | null {
        const value = control.value?.trim();
        if (value && value.length > LocationEventEditorForm.LOCATION_URL_MAX_LENGTH) {
            return { locationUrlMaxLength: { length: value.length } };
        }
        return null;
    }

    getForm(): LocationEventForm {
        return this.form;
    }

    getCurrentState(): { location: string | null; locationLink: string | null } {
        const name = this.form.location.value?.trim() ?? null;
        const url = this.form.locationLink.value?.trim() ?? null;

        if (!name && !url) {
            return { location: null, locationLink: null };
        }

        return { location: name, locationLink: url };
    }

    isValid(): boolean {
        const control = this.form.location;
        const controlLink = this.form.locationLink;
        const errors = control.errors;
        const linkErrors = controlLink.errors
        return (!errors || Object.keys(errors).length === 0) && (!linkErrors || Object.keys(linkErrors).length === 0);
    }

    getError(controlName: keyof LocationEventForm, errorName: string): ValidationErrors | null {
        const control = this.form[controlName];
        const errors = control.errors;
        return (errors && errors[errorName]) ?? null;
    }

    hasChanged(): boolean {
        const current = this.getCurrentState();
        return this.initialName !== current.location || this.initialUrl !== current.locationLink;
    }

    clear(): void {
        this.form.location.setValue("");
        this.form.locationLink.setValue("");
    }

    isEmpty(): boolean {
        const name = this.form.location.value?.trim();
        const url = this.form.locationLink.value?.trim();
        return !name && !url;
    }
}

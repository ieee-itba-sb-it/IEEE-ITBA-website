import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Event} from "../../models/event/event";


export type DataAnalysisEventForm = {
    passingScore: FormControl<number>;
    examStartDate: FormControl<Date | null>;
};

export class DataAnalysisEventEditorForm {
    private readonly passingScore: FormControl<number>;
    private readonly examStartDate: FormControl<Date | null>;
    private readonly form: FormGroup<DataAnalysisEventForm>;

    constructor(private readonly event: Event) {
        this.passingScore = new FormControl(
            event.passingScore ?? 83,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100)
                ]
            }
        );
        this.examStartDate = new FormControl(
            event.examStartDate ?? null,
            {
                validators: [
                    Validators.required,
                    DataAnalysisEventEditorForm.validateDateIsNotInThePast
                ]
            }
        );
        this.form = new FormGroup({
            passingScore: this.passingScore,
            examStartDate: this.examStartDate
        });
    }

    getForm(): DataAnalysisEventForm {
        return {
            passingScore: this.passingScore,
            examStartDate: this.examStartDate
        };
    }

    getCurrentState() {
        return {
            passingScore: this.passingScore.value,
            examStartDate: this.examStartDate.value
        };
    }

    getError(errorName: string): ValidationErrors | null {
        return this.passingScore.getError(errorName)
            ?? this.examStartDate.getError(errorName);
    }

    isValid(): boolean {
        return this.form.valid;
    }

    hasChanged(): boolean {
        return this.form.dirty;
    }

    private static validateDateIsNotInThePast(control: AbstractControl<Date | string | null>): ValidationErrors | null {
        const value = new Date(control.value);
        value.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (value < today) return { minDate: true };
        if (!control.value) return null;

        return null;
    }
}


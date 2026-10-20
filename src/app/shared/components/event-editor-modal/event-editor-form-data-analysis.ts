import {AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Event} from "../../models/event/event";
import {getArgentineDate, getArgentineTime, parseArgentineDate} from "../../argentina-time";
import {DATA_ANALYSIS_DEFAULT_PASSING_SCORE} from "../../models/event/data_analysis/exams";


export type DataAnalysisEventForm = {
    passingScore: FormControl<number>;
    // datetime-local value: "yyyy-MM-ddTHH:mm"
    examStartDate: FormControl<string | null>;
};

export class DataAnalysisEventEditorForm {
    static readonly DEFAULT_PASSING_SCORE = DATA_ANALYSIS_DEFAULT_PASSING_SCORE;

    private readonly passingScore: FormControl<number>;
    private readonly examStartDate: FormControl<string | null>;

    constructor(private readonly event: Event) {
        this.passingScore = new FormControl(
            event.passingScore ?? DataAnalysisEventEditorForm.DEFAULT_PASSING_SCORE,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100)
                ]
            }
        );
        const initialExamStartDate = DataAnalysisEventEditorForm.toInputValue(event.examStartDate);
        this.examStartDate = new FormControl(
            initialExamStartDate,
            {
                validators: [
                    DataAnalysisEventEditorForm.validateExamStartDateRequired,
                    DataAnalysisEventEditorForm.validateDateIsNotInThePast(initialExamStartDate)
                ]
            }
        );
    }

    // The controls are added to the event form, which becomes their parent: their state is read from them directly
    // because a FormGroup of their own would not be updated when they change
    private get controls(): AbstractControl[] {
        return [this.passingScore, this.examStartDate];
    }

    getForm(): DataAnalysisEventForm {
        return {
            passingScore: this.passingScore,
            examStartDate: this.examStartDate
        };
    }

    // While disabled, the exam fields are left untouched in the event
    getCurrentState(): Partial<Pick<Event, 'passingScore' | 'examStartDate'>> {
        if (!this.isEnabled()) return {};
        return {
            passingScore: this.passingScore.value,
            examStartDate: DataAnalysisEventEditorForm.fromInputValue(this.examStartDate.value)
        };
    }

    getExamStartDateValue(): string | null {
        return this.examStartDate.value;
    }

    setEnabled(enabled: boolean): void {
        this.controls.forEach(control => enabled ? control.enable() : control.disable());
    }

    isEnabled(): boolean {
        return this.examStartDate.enabled;
    }

    getError(errorName: string): ValidationErrors | null {
        return this.passingScore.getError(errorName)
            ?? this.examStartDate.getError(errorName);
    }

    isValid(): boolean {
        // A disabled control is never "valid", so check it is not invalid instead
        return this.controls.every(control => !control.invalid);
    }

    hasChanged(): boolean {
        return this.controls.some(control => control.dirty);
    }

    // Firestore returns a Timestamp, while the event may also hold a Date or an ISO string
    private static toInputValue(date: any): string | null {
        if (!date) return null;
        const value: Date = date?.toDate ? date.toDate() : new Date(date);
        if (isNaN(value.getTime())) return null;
        return `${getArgentineDate(value)}T${getArgentineTime(value)}`;
    }

    private static fromInputValue(value: string | null): Date | null {
        if (!value) return null;
        const [date, time] = value.split('T');
        return parseArgentineDate(date, time);
    }

    private static validateExamStartDateRequired(control: AbstractControl<string | null>): ValidationErrors | null {
        return control.value ? null : {examStartDateRequired: true};
    }

    // An already saved date is allowed to be in the past, otherwise the event could not be edited once exams start
    private static validateDateIsNotInThePast(initialValue: string | null): ValidatorFn {
        return (control: AbstractControl<string | null>): ValidationErrors | null => {
            if (!control.value || control.value === initialValue) return null;

            const value = new Date(control.value);
            value.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return value < today ? {minDate: true} : null;
        };
    }
}

import {Component, DestroyRef, OnInit} from "@angular/core";
import {AsyncPipe, DatePipe, NgFor, NgIf} from "@angular/common";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BreakpointObserver} from "@angular/cdk/layout";
import {map, Observable, startWith} from "rxjs";
import {Router} from "@angular/router";
import {EventService} from 'src/app/core/services/event/event.service';
import {AuthService} from 'src/app/core/services/authorization/auth.service';
import {IEEEuser} from "../../../../shared/models/ieee-user/ieee-user";
import {
    COUNTRY_CODES,
    DataAnalysisInscription,
    INSCRIPTION_OPTIONS,
    InscriptionOption,
    InscriptionOptionGroup,
    MAX_PYTHON_INTERESTS,
    MIN_AGE,
    NO_EXPERIENCE,
    Occupation,
    TERMS_AND_CONDITIONS_URL
} from "../../../../shared/models/event/data_analysis/inscription";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatStepperModule, StepperOrientation} from "@angular/material/stepper";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

type MultiChoiceForm = FormGroup<{
    selected: FormControl<string[]>;
    other: FormControl<string>;
}>;

type Country = { code: string; name: string };

const LINKEDIN_URL_PATTERN = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i;

// A multiple choice question is answered when at least one option is checked or the "other" text is filled
function multiChoiceValidator(max?: number): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const selected: string[] = group.get('selected')?.value ?? [];
        const other: string = group.get('other')?.value?.trim() ?? '';
        const count = selected.length + (other ? 1 : 0);

        if (count === 0) return {required: true};
        if (max && count > max) return {max: {max, actual: count}};
        return null;
    };
}

function countryValidator(control: AbstractControl<string>): ValidationErrors | null {
    if (!control.value) return null;
    return COUNTRY_CODES.includes(control.value) ? null : {country: true};
}

@Component({
    selector: 'app-inscription',
    templateUrl: './inscription.component.html',
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        DatePipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        TranslateModule
    ],
    styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
    readonly options = INSCRIPTION_OPTIONS;
    readonly Occupation = Occupation;
    readonly NO_EXPERIENCE = NO_EXPERIENCE;
    readonly minAge = MIN_AGE;
    readonly maxPythonInterests = MAX_PYTHON_INTERESTS;
    readonly termsUrl = TERMS_AND_CONDITIONS_URL;

    user: IEEEuser | null = null;
    loading = true;
    submitting = false;
    inscriptionOpen = false;
    inscriptionEnd: Date | null = null;

    stepperOrientation$: Observable<StepperOrientation>;
    countries: Country[] = [];
    filteredCountries$: Observable<Country[]>;

    readonly personalForm = new FormGroup({
        firstName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
        lastName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
        age: new FormControl<number | null>(null, [Validators.required, Validators.min(MIN_AGE), Validators.max(120)]),
        gender: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
        country: new FormControl('AR', {nonNullable: true, validators: [Validators.required, countryValidator]})
    });

    readonly occupationForm = new FormGroup({
        occupation: new FormControl<Occupation | null>(null, [Validators.required]),
        itbaCareer: new FormControl('', {nonNullable: true, validators: [Validators.required]})
    });

    readonly interestsForm = new FormGroup({
        referralSource: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
        motivation: this.createMultiChoice(),
        programmingLanguage: this.createMultiChoice(),
        pythonInterest: this.createMultiChoice(MAX_PYTHON_INTERESTS),
        linkedin: new FormControl('', {nonNullable: true, validators: [Validators.pattern(LINKEDIN_URL_PATTERN)]})
    });

    readonly consentsForm = new FormGroup({
        termsAccepted: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]}),
        sponsorDataSharing: new FormControl(false, {nonNullable: true})
    });

    constructor(
        private eventService: EventService,
        private authService: AuthService,
        private router: Router,
        private translate: TranslateService,
        private destroyRef: DestroyRef,
        breakpointObserver: BreakpointObserver
    ) {
        this.stepperOrientation$ = breakpointObserver.observe('(min-width: 800px)')
            .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));
    }

    ngOnInit(): void {
        this.setupConditionalFields();
        this.setupCountries();

        this.eventService.getDataAnalysisInscriptionStatus()
            .subscribe(status => {
                // Users already enrolled go straight to their exams, even if the inscription is closed
                if (status.enrolled) {
                    this.router.navigate(['/data-analysis/exams']).then();
                    return;
                }
                this.inscriptionOpen = status.open;
                if (!status.open) {
                    this.loading = false;
                    return;
                }
                if (!status.user) {
                    this.router.navigate(['/login']).then();
                    return;
                }
                this.user = status.user;
                this.inscriptionEnd = status.end;
                this.prefillFromUser(status.user);
                this.loading = false;
            });
    }

    private prefillFromUser(user: IEEEuser): void {
        const [firstName = '', ...lastNames] = (user.fullname ?? '').trim().split(/\s+/);
        this.personalForm.patchValue({firstName, lastName: lastNames.join(' ')});
        if (user.linkedin) this.interestsForm.controls.linkedin.setValue(user.linkedin);
    }

    private createMultiChoice(max?: number): MultiChoiceForm {
        return new FormGroup({
            selected: new FormControl<string[]>([], {nonNullable: true}),
            other: new FormControl('', {nonNullable: true})
        }, {validators: multiChoiceValidator(max)});
    }

    // The ITBA career only applies to ITBA students; disabling it keeps it out of the validation
    private setupConditionalFields(): void {
        const {occupation, itbaCareer} = this.occupationForm.controls;
        occupation.valueChanges.pipe(startWith(occupation.value), takeUntilDestroyed(this.destroyRef))
            .subscribe(value => value === Occupation.ITBA ? itbaCareer.enable() : itbaCareer.disable());
    }

    private setupCountries(): void {
        this.buildCountries(this.translate.currentLang);
        this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({lang}) => this.buildCountries(lang));

        const country = this.personalForm.controls.country;
        this.filteredCountries$ = country.valueChanges.pipe(
            startWith(country.value),
            map(value => this.filterCountries(value))
        );
    }

    private buildCountries(lang: string | undefined): void {
        const displayNames = new (Intl as any).DisplayNames([lang || 'es'], {type: 'region'});
        this.countries = COUNTRY_CODES
            .map(code => ({code, name: displayNames.of(code) as string}))
            .sort((a, b) => a.code === 'AR' ? -1 : b.code === 'AR' ? 1 : a.name.localeCompare(b.name));
    }

    private filterCountries(value: string): Country[] {
        if (!value || COUNTRY_CODES.includes(value)) return this.countries;
        const search = this.normalize(value);
        return this.countries.filter(country => this.normalize(country.name).includes(search));
    }

    private normalize(text: string): string {
        return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    }

    displayCountry = (code: string): string =>
        this.countries.find(country => country.code === code)?.name ?? code;

    optionLabel(group: InscriptionOptionGroup, option: InscriptionOption): string {
        return option.label ?? this.translate.instant(`DATAANALYSIS.INSCRIPTION.OPTIONS.${group}.${option.value}`);
    }

    isSelected(multiChoice: MultiChoiceForm, value: string): boolean {
        return multiChoice.controls.selected.value.includes(value);
    }

    // "No experience" is exclusive: checking it clears the other languages and vice versa
    toggleOption(multiChoice: MultiChoiceForm, value: string, checked: boolean, exclusiveValue?: string): void {
        const current = multiChoice.controls.selected.value;
        let selected = checked ? [...current, value] : current.filter(option => option !== value);

        if (checked && exclusiveValue) {
            selected = value === exclusiveValue
                ? [exclusiveValue]
                : selected.filter(option => option !== exclusiveValue);
        }
        if (checked && value === exclusiveValue) multiChoice.controls.other.setValue('');

        multiChoice.controls.selected.setValue(selected);
        multiChoice.markAsTouched();
    }

    get hasNoProgrammingExperience(): boolean {
        return this.isSelected(this.interestsForm.controls.programmingLanguage, NO_EXPERIENCE);
    }

    private buildInscription(): DataAnalysisInscription {
        const personal = this.personalForm.getRawValue();
        const {occupation, itbaCareer} = this.occupationForm.getRawValue();
        const interests = this.interestsForm.getRawValue();
        const optionalText = (text: string) => text.trim() || null;

        return {
            email: this.user.email,
            personal: {
                firstName: personal.firstName.trim(),
                lastName: personal.lastName.trim(),
                age: personal.age,
                gender: personal.gender,
                country: personal.country
            },
            occupation: {
                occupation,
                itbaCareer: occupation === Occupation.ITBA ? itbaCareer : null
            },
            interests: {
                referralSource: interests.referralSource,
                motivations: interests.motivation.selected,
                motivationOther: optionalText(interests.motivation.other),
                programmingLanguages: interests.programmingLanguage.selected,
                programmingLanguageOther: optionalText(interests.programmingLanguage.other),
                pythonInterests: interests.pythonInterest.selected,
                pythonInterestOther: optionalText(interests.pythonInterest.other),
                linkedin: optionalText(interests.linkedin)
            },
            consents: this.consentsForm.getRawValue(),
            submittedAt: new Date()
        };
    }

    get formValid(): boolean {
        return [this.personalForm, this.occupationForm, this.interestsForm, this.consentsForm]
            .every(form => form.valid);
    }

    enroll() {
        this.consentsForm.markAllAsTouched();
        if (!this.user || !this.inscriptionOpen || !this.formValid || this.submitting) return;

        // TODO: persist the inscription data once its storage is defined
        const inscription = this.buildInscription();

        this.submitting = true;
        this.eventService.enrollUserInDataAnalysis(this.user)
            .subscribe({
                next: () => this.router.navigate(['/data-analysis/exams']).then(),
                error: () => this.submitting = false
            });
    }

    goToHome() {
        this.router.navigate(['/data-analysis']).then();
    }
}

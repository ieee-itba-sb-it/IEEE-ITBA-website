import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MDBModalRef} from 'angular-bootstrap-md';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {EventService} from 'src/app/core/services/event/event.service';
import {Question, QuestionDraft} from 'src/app/shared/models/event/data_analysis/exams';

// Minimum options a question needs to make sense as multiple choice
const MIN_ANSWERS = 2;
const DEFAULT_ANSWERS = 4;

type ImageForm = FormGroup<{
    // Public URL once uploaded; a local preview URL while the image is pending
    url: FormControl<string>;
    alt: FormControl<string>;
    // File still to be uploaded, null once it is in the storage
    file: FormControl<File | null>;
}>;

type AnswerForm = FormGroup<{
    answer: FormControl<string>;
}>;

// The exam identifies the selected option by its text, so two options with the same text could not be told apart
const uniqueAnswers = (control: AbstractControl): ValidationErrors | null => {
    const texts = (control as FormArray<AnswerForm>).controls
        .map(answer => answer.controls.answer.value.trim().toLowerCase())
        .filter(text => text);
    return new Set(texts).size === texts.length ? null : {duplicated: true};
};

@Component({
    selector: 'app-question-editor-modal',
    templateUrl: './question-editor-modal.component.html',
    styleUrls: ['./question-editor-modal.component.css']
})
export class QuestionEditorModalComponent implements OnInit, OnDestroy {
    // Set through the modal's data: the question to edit, or nothing to create a new one
    question?: Question;
    @Output() saved = new EventEmitter<Question>();

    form = new FormGroup({
        question: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
        images: new FormArray<ImageForm>([]),
        answers: new FormArray<AnswerForm>([], [Validators.minLength(MIN_ANSWERS), uniqueAnswers]),
        correctIndex: new FormControl<number | null>(null, Validators.required)
    });

    saving = false;
    // i18n key of the error to show, null when there is none
    error: string | null = null;

    constructor(public modalRef: MDBModalRef, private eventService: EventService) { }

    get images(): FormArray<ImageForm> {
        return this.form.controls.images;
    }

    get answers(): FormArray<AnswerForm> {
        return this.form.controls.answers;
    }

    ngOnInit(): void {
        if (!this.question) {
            for (let i = 0; i < DEFAULT_ANSWERS; i++) this.addAnswer();
            return;
        }

        this.form.controls.question.setValue(this.question.question);
        this.question.images?.forEach(image => this.images.push(this.imageForm(image.url, image.alt ?? '')));
        this.question.answers.forEach(answer => this.addAnswer(answer.answer));
        const correctIndex = this.question.answers.findIndex(answer => answer.isCorrect);
        this.form.controls.correctIndex.setValue(correctIndex >= 0 ? correctIndex : null);
    }

    ngOnDestroy(): void {
        this.images.controls.forEach(image => this.revokePreview(image));
    }

    onFilesSelected(input: HTMLInputElement): void {
        Array.from(input.files ?? [])
            .filter(file => file.type.startsWith('image/'))
            .forEach(file => this.images.push(this.imageForm(URL.createObjectURL(file), '', file)));
        // Lets the same file be chosen again after removing it
        input.value = '';
    }

    removeImage(index: number): void {
        this.revokePreview(this.images.at(index));
        this.images.removeAt(index);
    }

    moveImage(index: number, offset: -1 | 1): void {
        const image = this.images.at(index);
        this.images.removeAt(index);
        this.images.insert(index + offset, image);
    }

    addAnswer(text = ''): void {
        this.answers.push(new FormGroup({
            answer: new FormControl(text, {nonNullable: true, validators: [Validators.required]})
        }));
    }

    removeAnswer(index: number): void {
        this.answers.removeAt(index);
        // Keep the correct option pointing to the same answer
        const correctIndex = this.form.controls.correctIndex;
        if (correctIndex.value === index) correctIndex.setValue(null);
        else if (correctIndex.value !== null && correctIndex.value > index) correctIndex.setValue(correctIndex.value - 1);
    }

    canRemoveAnswer(): boolean {
        return this.answers.length > MIN_ANSWERS;
    }

    save(): void {
        if (this.saving) return;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.error = this.validationError();
            return;
        }

        this.saving = true;
        this.error = null;
        this.uploadPendingImages().pipe(
            switchMap(() => this.persist(this.toDraft()))
        ).subscribe({
            next: question => {
                this.saved.emit(question);
                this.modalRef.hide();
            },
            error: err => {
                console.error(err);
                this.saving = false;
                this.error = 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.SAVE';
            }
        });
    }

    private persist(draft: QuestionDraft): Observable<Question> {
        if (!this.question) return this.eventService.createDataAnalysisQuestion(draft);
        const question: Question = {...draft, id: this.question.id};
        return this.eventService.updateDataAnalysisQuestion(question).pipe(map(() => question));
    }

    // Each uploaded image keeps its public URL in the form, so a failed save does not upload it again when retrying
    private uploadPendingImages(): Observable<unknown> {
        const uploads = this.images.controls
            .filter(image => image.controls.file.value)
            .map(image => this.eventService.uploadDataAnalysisQuestionImage(image.controls.file.value!).pipe(
                map(url => {
                    this.revokePreview(image);
                    image.patchValue({url, file: null});
                })
            ));
        return uploads.length ? forkJoin(uploads) : of(null);
    }

    private toDraft(): QuestionDraft {
        const {question, images, answers, correctIndex} = this.form.getRawValue();
        return {
            question,
            images: images.map(({url, alt}) => ({url, alt})),
            answers: answers.map(({answer}, i) => ({answer, isCorrect: i === correctIndex, selected: false}))
        };
    }

    private validationError(): string {
        const {question, answers, correctIndex} = this.form.controls;
        if (question.invalid) return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.QUESTION_REQUIRED';
        if (answers.hasError('minlength')) return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.MIN_ANSWERS';
        if (answers.controls.some(answer => answer.invalid)) return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.EMPTY_ANSWER';
        if (answers.hasError('duplicated')) return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.DUPLICATED_ANSWERS';
        if (correctIndex.invalid) return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.CORRECT_REQUIRED';
        return 'ADMIN.EXAMSTAB.QUESTIONS.EDITOR.ERRORS.SAVE';
    }

    private imageForm(url: string, alt: string, file: File | null = null): ImageForm {
        return new FormGroup({
            url: new FormControl(url, {nonNullable: true}),
            alt: new FormControl(alt, {nonNullable: true}),
            file: new FormControl<File | null>(file)
        });
    }

    private revokePreview(image: ImageForm): void {
        if (image.controls.file.value) URL.revokeObjectURL(image.controls.url.value);
    }
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {
    Question,
    Answer,
    UserExam,
    DataAnalysisUser,
    ExamAccess,
    ExamDayClosedError
} from "src/app/shared/models/event/data_analysis/exams"
import {EventService} from "../../../../../core/services/event/event.service";


@Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ["./exam.component.css"]
})
export class ExamComponent implements OnInit {
    loading: boolean = false;
    cantQuestions = 3;
    dataAnalysisUser: DataAnalysisUser | null = null;

    examId: number | null = null;
    reviewMode = false;
    showResult = false;
    submitting = false;
    // i18n key of the submit error, null when there is none
    submitError: string | null = null;
    // The exam was started on a previous day: it can no longer be submitted
    examClosed = false;

    currentExam: UserExam | null = null;
    submittedExam: UserExam | null = null;
    examForm!: FormGroup;
    questions: Question[] = [];

    approved_threshold: number = 0.83;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private eventService: EventService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.examId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loading = true;

        this.eventService.getDataAnalysisExam(this.examId, this.cantQuestions).subscribe({
            next: state => {
                switch (state.access) {
                    case ExamAccess.LOGIN:
                        return this.goToLogin();
                    case ExamAccess.INSCRIPTION:
                        return this.goToInscription();
                    case ExamAccess.UNAVAILABLE:
                        return this.goToExamList();
                }

                this.dataAnalysisUser = state.student;
                this.approved_threshold = state.passingThreshold;
                if (state.access === ExamAccess.REVIEW) {
                    this.submittedExam = state.exam;
                    this.reviewMode = true;
                } else {
                    this.currentExam = state.exam;
                    this.questions = state.exam.questions;
                    this.buildForm();
                }
                this.loading = false;
            },
            error: err => {
                console.error(`getDataAnalysisExam failed: ${err}`);
                this.goToExamList();
            }
        });
    }

    initForm() {
        this.examForm = this.fb.group({
            answers: this.fb.array([])
        });
    }

    buildForm() {
        this.questions.forEach(q => {
            this.answersArray.push(
                this.fb.group({
                    questionId: [q.id],
                    answer: ['']
                })
            );
        });
    }

    get answersArray(): FormArray {
        return this.examForm.get('answers') as FormArray;
    }

    onSubmit() {
        if(!this.dataAnalysisUser || !this.currentExam || this.submitting || this.examClosed) return

        const submittedQuestions: Question[] = this.questions.map((q, i) => {
            const selectedAnswer = this.answersArray.controls[i].value.answer;
            return {
                ...q,
                answers: q.answers.map(a => ({
                    ...a,
                    selected: a.answer === selectedAnswer
                }))
            };
        });

        const passed = this.eventService.evaluateExam(submittedQuestions, this.approved_threshold);
        const exam: UserExam = {
            passed,
            submitted: true,
            started: this.currentExam.started,
            questions: submittedQuestions
        };

        this.submitting = true;
        this.submitError = null;
        this.eventService.submitExam(this.dataAnalysisUser, exam).subscribe({
            next: () => {
                this.submitting = false;
                this.submittedExam = exam;
                this.reviewMode = true;
                this.showResult = true;
            },
            error: err => {
                this.submitting = false;
                if (err instanceof ExamDayClosedError) {
                    this.examClosed = true;
                    this.submitError = 'DATAANALYSIS.EMBEDDED_EXAM.EXAM.SUBMIT_ERROR_DAY_CLOSED';
                    return;
                }
                // The answers stay in the form so the student can submit again
                console.error(`submitExam failed: ${err}`);
                this.submitError = 'DATAANALYSIS.EMBEDDED_EXAM.EXAM.SUBMIT_ERROR';
            }
        });
    }

    getSelectedAnswer(answers: Answer[]): string {
        return answers.find(a => a.selected)?.answer ?? '';
    }

    goBack() {
        this.router.navigate(['/data-analysis/exams']).then(() => {});
    }

    goToInscription():void{
        this.router.navigate(['/data-analysis/inscription']).then(() => {});
        this.loading = false;
        return;
    }
    goToLogin():void{
        this.router.navigate(['/login']).then(() => {});
        this.loading = false;
        return;
    }

    goToExamList():void{
        this.router.navigate(['/data-analysis/exams']).then(() => {});
        this.loading = false;
        return;
    }
}

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Question, Answer, UserExam, DataAnalysisUser} from "src/app/shared/models/event/data_analysis/exams"
import {AuthService} from "../../../../../core/services/authorization/auth.service";
import {EventService} from "../../../../../core/services/event/event.service";
import {IEEEuser} from 'src/app/shared/models/ieee-user/ieee-user';


@Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ["./exam.component.css"]
})
export class ExamComponent implements OnInit {
    loading: boolean = false;
    cantQuestions = 3;
    user: IEEEuser | null = null;
    dataAnalysisUser: DataAnalysisUser | null = null;

    examId: number | null = null;
    reviewMode = false;
    showResult = false;

    submittedExam: UserExam | null = null;
    examForm!: FormGroup;
    questions: Question[] = [];

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private eventService: EventService,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.examId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loading = true;

        this.authService.getCurrentUser().subscribe(user => {
            if (!user){
                this.router.navigate(['/login']).then(() => {});
                this.loading = false;
                return;
            }
            this.user = user;
            this.eventService.getDataAnalysisUser(user).subscribe(student=> {
                if (!student) {
                    this.router.navigate(['/data-analysis/exams/subscribe-exam']).then(() => {});
                    this.loading = false;
                    return;
                }
                this.dataAnalysisUser = student;
                const exam = student.currentExam;

                if (exam) {
                    const started = exam.started instanceof Date
                        ? exam.started
                        : (exam.started as any).toDate();

                    const isToday = exam && this.isToday(started);
                    if (isToday) {
                        if(exam.submitted) {
                            this.submittedExam = exam;
                            this.reviewMode = true;
                        }
                        else{
                            this.questions = exam.questions;
                            this.buildForm();
                        }
                    } else {
                        // !isToday -> lo sentimos, tu examen ya no se encuentra disponible (?)
                    }
                    this.loading = false;
                } else {
                    this.loading = true;
                    this.eventService.generateExam(this.cantQuestions, user).subscribe(newExam => {
                        this.questions = newExam.questions;
                        this.buildForm();
                        this.loading = false;
                    });

                }
            });
        });
    }

    isToday(date: Date): boolean {
        const now = new Date();
        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
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
        if(!this.dataAnalysisUser) return

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

        const passed = this.eventService.evaluateExam(submittedQuestions);
        this.submittedExam = {
            passed,
            submitted: true,
            started: new Date(),
            questions: submittedQuestions
        };

        this.eventService.submitExam(this.dataAnalysisUser, this.submittedExam).subscribe(() => {
            this.reviewMode = true;
            this.showResult = true;
        });
    }

    getSelectedAnswer(answers: Answer[]): string {
        return answers.find(a => a.selected)?.answer ?? '';
    }

    goBack() {
        this.router.navigate(['/data-analysis/exams']).then(() => {});
    }
}

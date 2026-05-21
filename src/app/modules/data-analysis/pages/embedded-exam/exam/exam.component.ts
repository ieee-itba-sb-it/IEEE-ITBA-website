import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {Question, Answer, UserExam} from "src/app/shared/models/event/data_analysis/exams"
import {AuthService} from "../../../../../core/services/authorization/auth.service";
import {EventService} from "../../../../../core/services/event/event.service";
import {IEEEuser} from 'src/app/shared/models/ieee-user/ieee-user';


@Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ["./exam.component.css"]
})
export class ExamComponent implements OnInit {
    cantQuestions = 3;
    user: IEEEuser | null = null;

    examId: number | null = null;
    reviewMode = false;

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

        this.authService.getCurrentUser().subscribe(user => {
            if (!user) return;
            this.user = user;
            this.eventService.getUserExam(user).subscribe(exam => {
                if (exam) {
                    const started = (exam.started as any).toDate();
                    const isToday = exam && this.isToday(started);
                    if (isToday && exam.submitted) {
                        this.submittedExam = exam;
                        this.reviewMode = true;
                    } else if (isToday && !exam.submitted) {
                        this.questions = exam.questions;
                        this.buildForm();
                    }
                    else {
                        // !isToday -> lo sentimos, tu examen ya no se encuentra disponible (?)
                    }
                } else {
                    this.eventService.generateExam(this.cantQuestions, user).subscribe(newExam => {
                        this.questions = newExam.questions;
                        this.buildForm();
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

        const reviewQuestions: Question[] = this.questions.map((q, i) => {
            const selectedAnswer = this.answersArray.controls[i].value.answer;
            return {
                ...q,
                answers: q.answers.map(a => ({
                    ...a,
                    selected: a.answer === selectedAnswer
                }))
            };
        });

        this.submittedExam = {
            user: this.user.email ?? '',
            passed: this.correctExam(reviewQuestions),
            submitted: true,
            started: new Date(),
            questions: reviewQuestions
        };

        this.eventService.submitExam(this.submittedExam).subscribe(() => {
            this.reviewMode = true;
        });
        //alert(result ? 'Aprobaste !' : 'Desaprobado :\'p');
    }

    correctExam(questions: Question[]): boolean {
        let correctCount = 0;
        questions.forEach(q => {
            const selected = q.answers.find(a => a.selected)?.answer ?? '';
            const correct = q.answers.find(a => a.isCorrect)?.answer ?? '';
            if (this.compare(selected, correct)) correctCount++;
        });
        return correctCount >= 1;

    }

    compare(selected: string, correct: string): boolean {
        return String(selected ?? '').trim().toLowerCase().includes(correct.toLowerCase());
    }

    getSelectedAnswer(answers: Answer[]): string {
        return answers.find(a => a.selected)?.answer ?? '';
    }
    
    goBack() {
        this.router.navigate(['/data-analysis/exams']).then(() => {});
    }
}

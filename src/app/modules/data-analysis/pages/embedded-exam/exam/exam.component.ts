import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {Question, Answer, SubmittedExam} from "src/app/shared/models/event/data_analysis/exams"

interface FormAnswer {
    questionId: number;
    answer: string;
}

@Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html',
    styleUrls: ["./exam.component.css"]

})
export class ExamComponent implements OnInit {

    examId: number | null=null;
    reviewMode = false;

    submittedExam: SubmittedExam | null = null;
    examForm!: FormGroup;
    questions: Question[] = [];

    //sacadas de Banco de Preguntas - Quiz
    private mockQuestions: Question[] = [
        {
            id: 1,
            question: '¿Cuál de las siguientes opciones te permite conocer las columnas de un DataFrame?',
            answers: [
                {answer: 'df.shape', isCorrect:false, selected:false},
                {answer: 'df.head', isCorrect:false, selected:false},
                {answer: 'df.keys', isCorrect:true, selected:false},
                {answer: 'df.values', isCorrect:false, selected:false}
            ],
        },
        {
            id: 2,
            question: '¿Cuál comando obtiene la categoría más frecuente?',
            answers: [
                {answer: 'archivo[\'Categoría\'].value_counts().idxmax()', isCorrect:false, selected:false},
                {answer: 'archivo[\'Categoría\'].value_counts().max()', isCorrect:false, selected:false},
                {answer: 'archivo[\'Categoría\'].idxmax().value_counts()', isCorrect:true, selected:false},
                {answer: 'archivo[\'Categoría\'].max().value_counts()', isCorrect:false, selected:false}
            ],
        },
    ];
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.examId = Number(this.route.snapshot.paramMap.get('id'));
        console.log('Examen cargado', this.examId);
        this.initForm();
        this.loadQuestions();
    }

    initForm() {
        this.examForm = this.fb.group({
            answers: this.fb.array([])
        });
    }

    loadQuestions() {
        this.questions = this.mockQuestions;
        this.buildForm();
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
            console.log(`Pregunta ${i}:`, selectedAnswer);
            return {
                ...q,
                answers: q.answers.map(a => ({
                    ...a,
                    selected: a.answer === selectedAnswer
                }))
            };
        });

        this.submittedExam = {
            user: '',
            passed: this.correctExam(reviewQuestions),
            submitted: true,
            started: new Date(),
            questions: reviewQuestions
        };
        this.reviewMode = true;
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

    compare(user: string, correct: string): boolean {
        return String(user ?? '').trim().toLowerCase().includes(correct.toLowerCase());
    }

    getSelectedAnswer(answers: Answer[]): string {
        return answers.find(a => a.selected)?.answer ?? '';
    }
}

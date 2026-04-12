import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

interface Question {
    id: number;
    statement: string;
    type: 'multiple-choice' | 'code';
    options?: string[];
    correctAnswer: string;
}

interface Answer {
    questionId: number;
    answer: string;
}

@Component({
    selector: 'app-exam',
    templateUrl: './exam.component.html'
})
export class ExamComponent implements OnInit {

    examForm!: FormGroup;
    questions: Question[] = [];

    //sacadas de Banco de Preguntas - Quiz
    private mockQuestions: Question[] = [
        {
            id: 1,
            statement: '¿Cuál de las siguientes opciones te permite conocer las columnas de un DataFrame?',
            type: 'multiple-choice',
            options: ['df.shape', 'df.head', 'df.keys()', 'df.values'],
            correctAnswer: 'df.keys()'
        },
        {
            id: 2,
            statement: '¿Cuál comando obtiene la categoría más frecuente?',
            type: 'multiple-choice',
            options: [
                "archivo['Categoría'].value_counts().idxmax()",
                "archivo['Categoría'].value_counts().max()",
                "archivo['Categoría'].idxmax().value_counts()",
                "archivo['Categoría'].max().value_counts()"
            ],
            correctAnswer: "archivo['Categoría'].value_counts().idxmax()"
        },
    ];
    constructor(private fb: FormBuilder) {}
    ngOnInit(): void {
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
        const answers: Answer[] = this.examForm.value.answers;

        const result = this.correctExam(answers);

        console.log('Respuestas:', answers);
        console.log('Resultado:', result);

        alert(result ? 'Aprobaste !' : 'Desaprobado :\'p');
    }

    correctExam(answers: Answer[]): boolean {
        let correctCount = 0;

        answers.forEach(ans => {
            const q = this.questions.find(q => q.id === ans.questionId);
            if (!q) return;

            if (this.compare(ans.answer, q.correctAnswer)) {
                correctCount++;
            }
        });

        return correctCount >= 1; //se aprueba con una bien
    }

    compare(user: string, correct: string): boolean {
        return user?.trim().toLowerCase().includes(correct.toLowerCase());
    }
}

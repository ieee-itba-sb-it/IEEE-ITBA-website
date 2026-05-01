export type Answer = {
    answer: string;
    isCorrect: boolean;
    selected?: boolean;
}

export type Question = {
    id: number;
    question: string;
    answers: Answer[];
}

export type UserExam = {
    user: string;
    passed: boolean;
    submitted: boolean;
    started: Date;
    questions: Question[];
}

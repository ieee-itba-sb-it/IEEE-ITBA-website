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
    passed: boolean;
    submitted: boolean;
    started: Date;
    questions: Question[];
}

export type DataAnalysisUser = {
    user: string;
    enrolledAt: Date;
    currentExam?: UserExam;
    passedCourse: boolean;
}

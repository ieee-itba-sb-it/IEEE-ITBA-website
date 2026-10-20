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

// Stored in events/DATA_ANALYSIS/editions/{edition}/students/{email}
export type DataAnalysisUser = {
    email: string;
    edition: string;
    firstName: string;
    lastName: string;
    enrolledAt: Date;
    termsAcceptedAt: Date;
    sponsorDataSharing: boolean;
    // Only stored when the user agreed to share their data with sponsors
    linkedin?: string;
    currentExam?: UserExam;
    passedCourse: boolean;
}

// One exam per day during the course
export const DATA_ANALYSIS_EXAM_DAYS = 7;

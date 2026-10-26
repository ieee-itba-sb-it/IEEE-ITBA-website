import {QueryDocumentSnapshot} from "@angular/fire/firestore";

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
    // Must fall on the same day as started: the exam counts for that day
    submittedAt?: Date;
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

// Percentage of correct answers needed to pass, when the event does not define one
export const DATA_ANALYSIS_DEFAULT_PASSING_SCORE = 83;

export enum ExamAccess {
    LOGIN = 'LOGIN',
    INSCRIPTION = 'INSCRIPTION',
    // Not today's exam, the exams are closed or the student already passed the course
    UNAVAILABLE = 'UNAVAILABLE',
    OPEN = 'OPEN',
    REVIEW = 'REVIEW'
}

export type DataAnalysisExamState =
    | { access: ExamAccess.LOGIN | ExamAccess.INSCRIPTION | ExamAccess.UNAVAILABLE }
    | {
        access: ExamAccess.OPEN | ExamAccess.REVIEW;
        student: DataAnalysisUser;
        exam: UserExam;
        // Share of correct answers needed to pass (0-1)
        passingThreshold: number;
    };

export class ExamDayClosedError extends Error {
    constructor() {
        super('The exam was started on another day and can no longer be submitted');
    }
}

export enum StudentStatus {
    PASSED = 'PASSED',
    // Has not passed yet but the exams are still open
    IN_PROGRESS = 'IN_PROGRESS',
    // Did not pass and the exams are closed
    FAILED = 'FAILED'
}

export type DataAnalysisStudentRow = DataAnalysisUser & {
    status: StudentStatus;
};

export type DataAnalysisStudentsPage = {
    students: DataAnalysisStudentRow[];
    // Last student of the page, from where the next page starts; null when the page is empty
    cursor: QueryDocumentSnapshot | null;
};

export type DataAnalysisStudentsSummary = {
    total: number;
    byStatus: Record<StudentStatus, number>;
    // Whether the students that have not passed can still take exams
    examsOpen: boolean;
};

// Last moment an exam can be taken: the end of the last exam day, or null when the exams have no start date yet
export const getExamsEnd = (examStartDate: Date | null): Date | null => {
    if (!examStartDate) return null;
    const end = new Date(examStartDate);
    end.setDate(end.getDate() + DATA_ANALYSIS_EXAM_DAYS - 1);
    end.setHours(23, 59, 59, 999);
    return end;
};

// Students of past editions can no longer take exams. In the current edition the exams stay open until the last
// exam day (or indefinitely while they have no start date)
export const areExamsOpen = (isCurrentEdition: boolean, examsEnd: Date | null, now: Date = new Date()): boolean =>
    isCurrentEdition && (!examsEnd || now <= examsEnd);

export const getStudentStatus = (student: DataAnalysisUser, examsOpen: boolean): StudentStatus => {
    if (student.passedCourse) return StudentStatus.PASSED;
    return examsOpen ? StudentStatus.IN_PROGRESS : StudentStatus.FAILED;
};

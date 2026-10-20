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
export const getStudentStatus = (
    student: DataAnalysisUser,
    isCurrentEdition: boolean,
    examsEnd: Date | null,
    now: Date = new Date()
): StudentStatus => {
    if (student.passedCourse) return StudentStatus.PASSED;
    const examsOpen = isCurrentEdition && (!examsEnd || now <= examsEnd);
    return examsOpen ? StudentStatus.IN_PROGRESS : StudentStatus.FAILED;
};

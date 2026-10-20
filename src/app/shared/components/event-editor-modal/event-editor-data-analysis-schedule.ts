import {Event, EventDate, EventStatus} from "../../models/event/event";
import {getArgentineDate, getArgentineTime, parseArgentineDate} from "../../argentina-time";
import {getEditionId} from "../../models/event/data_analysis/inscription";
import {DATA_ANALYSIS_EXAM_DAYS} from "../../models/event/data_analysis/exams";

export type ScheduleError = {
    key: string;
    params?: Record<string, string>;
};

// Students enrolled in the edition the event had when the modal was opened
export type InitialEditionState = {
    editionId: string | null;
    // null while it is being loaded
    enrolledStudents: number | null;
    // The students could not be counted, so changing the edition can not be allowed
    countFailed: boolean;
    // Last day of the course of that edition, null when it is unknown
    courseEnd: Date | null;
};

type ScheduleInput = {
    dates: Event['dates'];
    // datetime-local value ("yyyy-MM-ddTHH:mm") or null when not set
    examStartDate: string | null;
    // Whether each date has valid values on its own; otherwise its own errors are shown instead
    isEventDateValid: (eventDate: EventDate) => boolean;
    initialEdition: InitialEditionState;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const addDays = (isoDate: string, days: number): string => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return getArgentineDate(new Date(new Date(year, month - 1, day).getTime() + days * DAY_MS));
};

// "yyyy-mm-dd" -> "dd/mm/yyyy"
const display = (isoDate: string): string => isoDate.split('-').reverse().join('/');

// "dd/mm/yyyy hh:mm"
const displayDateTime = (date: Date): string => `${display(getArgentineDate(date))} ${getArgentineTime(date)}`;

const confirmedDate = (input: ScheduleInput, eventDate: EventDate) => {
    const date = input.dates[eventDate];
    return date.status === EventStatus.CONFIRMED && input.isEventDateValid(eventDate) ? date : null;
};

// The exams (one per day) must fall within the event dates
function getExamErrors(input: ScheduleInput): ScheduleError[] {
    const event = confirmedDate(input, EventDate.EVENT);
    if (!event || !input.examStartDate) return [];

    const days = DATA_ANALYSIS_EXAM_DAYS.toString();
    if (!event.isPeriod) {
        return [{key: 'EVENT_NOT_PERIOD', params: {days}}];
    }

    const eventStart = getArgentineDate(event.date);
    const eventEnd = getArgentineDate(event.lastDate);
    const examStart = input.examStartDate.split('T')[0];
    const examEnd = addDays(examStart, DATA_ANALYSIS_EXAM_DAYS - 1);

    const errors: ScheduleError[] = [];
    if (examStart < eventStart) {
        errors.push({key: 'EXAMS_START_BEFORE_EVENT', params: {examStart: display(examStart), eventStart: display(eventStart)}});
    }
    if (examEnd > eventEnd) {
        errors.push({
            key: 'EXAMS_END_AFTER_EVENT',
            params: {days, examStart: display(examStart), examEnd: display(examEnd), eventEnd: display(eventEnd)}
        });
    }
    return errors;
}

// The inscription can stay open during the theory classes at the start of the course, so it can be extended when
// there are few students, but it must close before the exams start
function getInscriptionErrors(input: ScheduleInput): ScheduleError[] {
    const inscription = confirmedDate(input, EventDate.INSCRIPTION);
    if (!inscription || !input.examStartDate) return [];

    const inscriptionEnd = inscription.isPeriod ? inscription.lastDate : inscription.date;
    const [examDate, examTime] = input.examStartDate.split('T');
    const examStart = parseArgentineDate(examDate, examTime);
    if (inscriptionEnd.getTime() < examStart.getTime()) return [];

    return [{
        key: 'INSCRIPTION_ENDS_AFTER_EXAMS_START',
        params: {inscriptionEnd: displayDateTime(inscriptionEnd), examStart: displayDateTime(examStart)}
    }];
}

// The edition comes from the inscription start date. Moving it to another semester (or unconfirming it) while the
// current edition has students and its course has not ended would leave those students without access to their exams
function getEditionErrors(input: ScheduleInput): ScheduleError[] {
    const {editionId, enrolledStudents, countFailed, courseEnd} = input.initialEdition;
    if (!editionId) return [];

    const inscription = input.dates[EventDate.INSCRIPTION];
    const newEditionId = inscription.status === EventStatus.CONFIRMED && inscription.date && !isNaN(inscription.date.getTime())
        ? getEditionId(inscription.date)
        : null;
    if (newEditionId === editionId) return [];

    if (countFailed) {
        return [{key: 'EDITION_CHECK_FAILED', params: {edition: editionId}}];
    }
    if (enrolledStudents === null) {
        return [{key: 'EDITION_CHECK_LOADING', params: {edition: editionId}}];
    }
    const courseEnded = !!courseEnd && getArgentineDate(courseEnd) < getArgentineDate(new Date());
    if (enrolledStudents === 0 || courseEnded) return [];

    const params = {edition: editionId, students: enrolledStudents.toString()};
    return newEditionId
        ? [{key: 'EDITION_CHANGE_WITH_STUDENTS', params: {...params, newEdition: newEditionId}}]
        : [{key: 'EDITION_REMOVED_WITH_STUDENTS', params}];
}

export function getDataAnalysisScheduleErrors(input: ScheduleInput): ScheduleError[] {
    return [
        ...getExamErrors(input),
        ...getInscriptionErrors(input),
        ...getEditionErrors(input)
    ];
}

// When the course of an edition ends: the event end date, or the last exam day when the event has no period
export function getDataAnalysisCourseEnd(event: Event): Date | null {
    const eventDate = event.dates[EventDate.EVENT];
    if (eventDate.status === EventStatus.CONFIRMED && eventDate.isPeriod) return eventDate.lastDate;
    if (!event.examStartDate) return null;

    const examStart: Date = (event.examStartDate as any)?.toDate ? (event.examStartDate as any).toDate() : new Date(event.examStartDate);
    return new Date(examStart.getTime() + (DATA_ANALYSIS_EXAM_DAYS - 1) * DAY_MS);
}

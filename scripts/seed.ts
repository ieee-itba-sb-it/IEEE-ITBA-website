import {FieldValue, getFirestore} from "firebase-admin/firestore";
import {
    DataAnalysisInscription,
    DataAnalysisMetrics,
    getEditionId,
    getInscriptionMetricValues,
    Occupation
} from "../src/app/shared/models/event/data_analysis/inscription";

const questions = [
    {
        id: 1,
        question: '¿Cuál de las siguientes opciones te permite conocer las columnas de un DataFrame?',
        answers: [
            {answer: 'df.shape', isCorrect: false, selected: false},
            {answer: 'df.head', isCorrect: false, selected: false},
            {answer: 'df.keys', isCorrect: true, selected: false},
            {answer: 'df.values', isCorrect: false, selected: false}
        ]
    },
    {
        id: 2,
        question: '¿Cuál comando obtiene la categoría más frecuente?',
        answers: [
            {answer: "archivo['Categoría'].value_counts().idxmax()", isCorrect: true, selected: false},
            {answer: "archivo['Categoría'].value_counts().max()", isCorrect: false, selected: false},
            {answer: "archivo['Categoría'].idxmax().value_counts()", isCorrect: false, selected: false},
            {answer: "archivo['Categoría'].max().value_counts()", isCorrect: false, selected: false}
        ]
    },
    {
        id: 3,
        question: 'p3',
        answers: [
            {answer: "p3.a1", isCorrect: true, selected: false},
            {answer: "p3.a2", isCorrect: false, selected: false},
            {answer: "p3.a3", isCorrect: false, selected: false},
            {answer: "p3.a4", isCorrect: false, selected: false}
        ]
    },
    {
        id: 4,
        question: 'p4',
        answers: [
            {answer: "p4.a1", isCorrect: true, selected: false},
            {answer: "p4.a2", isCorrect: false, selected: false},
            {answer: "p4.a3", isCorrect: false, selected: false},
            {answer: "p4.a4", isCorrect: false, selected: false}
        ]
    },
    {
        id: 5,
        question: 'p5',
        answers: [
            {answer: "p5.a1", isCorrect: true, selected: false},
            {answer: "p5.a2", isCorrect: false, selected: false},
            {answer: "p5.a3", isCorrect: false, selected: false},
            {answer: "p5.a4", isCorrect: false, selected: false}
        ]
    }
];

export async function seedQuestions() {
    const db = getFirestore()

    await db.collection('events')
        .doc('DATA_ANALYSIS')
        .set({
            passingScore: 83 // porcentaje (0-100)
        }, { merge: true });

    for (const q of questions) {
        await db.collection('events')
            .doc('DATA_ANALYSIS')
            .collection('questions')
            .doc(q.id.toString()).set(q)
        console.log(`Pregunta ${q.id} cargada`);
    }

    console.log('Preguntas cargadas :p');
}

const DAY_MS = 24 * 60 * 60 * 1000;

const toIsoDate = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

type SampleAnswers = Pick<DataAnalysisInscription, 'occupation' | 'interests'> & {
    personal: Omit<DataAnalysisInscription['personal'], 'firstName' | 'lastName'>;
    sponsorDataSharing: boolean;
};

const sampleInscription = (email: string, firstName: string, lastName: string, answers: SampleAnswers): DataAnalysisInscription => ({
    email,
    personal: {firstName, lastName, ...answers.personal},
    occupation: answers.occupation,
    interests: answers.interests,
    consents: {termsAccepted: true, sponsorDataSharing: answers.sponsorDataSharing}
});

const sampleInscriptions: DataAnalysisInscription[] = [
    sampleInscription('ana.gomez@example.com', 'Ana', 'Gómez', {
        personal: {age: 21, gender: 'FEMALE', country: 'AR'},
        occupation: {occupation: Occupation.ITBA, itbaCareer: 'COMPUTER_ENGINEERING'},
        interests: {
            referralSource: 'INSTAGRAM',
            motivations: ['PROFESSIONAL_DEVELOPMENT'], motivationOther: null,
            programmingLanguages: ['PYTHON', 'C'], programmingLanguageOther: null,
            pythonInterests: ['DATA_ANALYSIS', 'MACHINE_LEARNING'], pythonInterestOther: null,
            linkedin: 'https://www.linkedin.com/in/ana-gomez'
        },
        sponsorDataSharing: true
    }),
    sampleInscription('bruno.diaz@example.com', 'Bruno', 'Díaz', {
        personal: {age: 16, gender: 'MALE', country: 'AR'},
        occupation: {occupation: Occupation.SCHOOL, itbaCareer: null},
        interests: {
            referralSource: 'FRIEND',
            motivations: ['PERSONAL_INTEREST'], motivationOther: null,
            programmingLanguages: ['NONE'], programmingLanguageOther: null,
            pythonInterests: ['GAME_DESIGN'], pythonInterestOther: 'Robótica',
            linkedin: null
        },
        sponsorDataSharing: false
    }),
    sampleInscription('carla.ruiz@example.com', 'Carla', 'Ruiz', {
        personal: {age: 29, gender: 'PREFER_NOT_TO_SAY', country: 'UY'},
        occupation: {occupation: Occupation.WORK, itbaCareer: null},
        interests: {
            referralSource: 'LINKEDIN',
            motivations: ['CURRENT_JOB'], motivationOther: 'Cambio de carrera',
            programmingLanguages: ['JAVASCRIPT'], programmingLanguageOther: 'SQL',
            pythonInterests: ['DATA_ANALYSIS', 'WEB_DEVELOPMENT'], pythonInterestOther: null,
            linkedin: 'https://www.linkedin.com/in/carla-ruiz'
        },
        // Has LinkedIn but did not consent: it must not be stored
        sponsorDataSharing: false
    })
];

// Adds the counts of each inscription exactly like EventService does with increments
const aggregateMetrics = (inscriptions: DataAnalysisInscription[]): Partial<DataAnalysisMetrics> =>
    inscriptions.reduce((metrics, inscription) => {
        const metricValues = getInscriptionMetricValues(inscription);
        Object.keys(metricValues).forEach(field => {
            metrics[field] = metrics[field] ?? {};
            metricValues[field].forEach((value: string) => metrics[field][value] = (metrics[field][value] ?? 0) + 1);
        });
        metrics.total = (metrics.total ?? 0) + 1;
        return metrics;
    }, {} as Partial<DataAnalysisMetrics>);

// One exam per day during the course (see ExamListComponent)
const EXAM_DAYS = 7;

// Leaves DATA_ANALYSIS with a consistent timeline and the current edition with sample students and their metrics:
// - inscription open from a week ago until the end of today
// - event (the course) confirmed from today, when exams start, until the last exam day
// Re-running it resets the edition
export async function seedDataAnalysisEdition() {
    const db = getFirestore();
    const eventRef = db.collection('events').doc('DATA_ANALYSIS');

    const today = new Date();
    const inscriptionStart = new Date(today.getTime() - 7 * DAY_MS);
    const examStart = new Date(today);
    examStart.setHours(12, 0, 0, 0);
    const eventEnd = new Date(examStart.getTime() + (EXAM_DAYS - 1) * DAY_MS);

    await eventRef.set({
        dates: {
            INSCRIPTION: {
                status: 'CONFIRMED',
                date: toIsoDate(inscriptionStart),
                time: '00:00',
                lastDate: toIsoDate(today),
                lastTime: '23:59'
            },
            EVENT: {
                status: 'CONFIRMED',
                date: toIsoDate(examStart),
                time: '12:00',
                lastDate: toIsoDate(eventEnd),
                lastTime: '23:59'
            }
        },
        examStartDate: examStart
    }, {merge: true});

    const editionId = getEditionId(inscriptionStart);
    const editionRef = eventRef.collection('editions').doc(editionId);
    await db.recursiveDelete(editionRef);

    for (const inscription of sampleInscriptions) {
        const {personal, consents, interests} = inscription;
        await editionRef.collection('students').doc(inscription.email).set({
            email: inscription.email,
            edition: editionId,
            firstName: personal.firstName,
            lastName: personal.lastName,
            enrolledAt: FieldValue.serverTimestamp(),
            termsAcceptedAt: FieldValue.serverTimestamp(),
            sponsorDataSharing: consents.sponsorDataSharing,
            ...(consents.sponsorDataSharing && interests.linkedin && {linkedin: interests.linkedin}),
            passedCourse: false
        });
        console.log(`Alumno ${inscription.email} cargado en ${editionId}`);
    }

    await editionRef.collection('metrics').doc('summary').set(aggregateMetrics(sampleInscriptions));
    console.log(`Edición ${editionId} cargada: inscripción del ${toIsoDate(inscriptionStart)} al ${toIsoDate(today)}, `
        + `curso y exámenes del ${toIsoDate(examStart)} al ${toIsoDate(eventEnd)}`);
}

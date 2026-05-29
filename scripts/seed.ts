import {getFirestore} from "firebase-admin/firestore";

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
        .set({startDate: new Date('2026-05-28T12:00:00')});

    for (const q of questions) {
        await db.collection('events')
            .doc('DATA_ANALYSIS')
            .collection('questions')
            .doc(q.id.toString()).set(q)
        console.log(`Pregunta ${q.id} cargada`);
    }

    console.log('Preguntas cargadas :p');
}

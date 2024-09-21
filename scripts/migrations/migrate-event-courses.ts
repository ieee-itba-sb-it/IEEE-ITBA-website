import {getFirestore} from "firebase-admin/firestore";
import {EventCourse, IeeeEvent} from "../../src/app/shared/models/event/event";

type IeeeEventWithCourses = IeeeEvent.PYTHON_COURSE | IeeeEvent.DATA_ANALYSIS | IeeeEvent.TYPESCRIPT_COURSE;

const eventCourseClassesByEventId: Record<IeeeEventWithCourses, EventCourse> = {
    [IeeeEvent.PYTHON_COURSE]: [{
        titleCode: 'PYTHONCOURSES.CLASSES.TITLE',
        descriptionCode: 'PYTHONCOURSES.CLASSES.C1',
        contentLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_1_Introducción_a_la_Programación_con_Python.ipynb',
        solutionsLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_1_Curso_Introductorio_de_Python.ipynb'
    }, {
        titleCode: 'PYTHONCOURSES.CLASSES.TITLE',
        descriptionCode: 'PYTHONCOURSES.CLASSES.C2',
        contentLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_2_Introducción_a_la_Programación_con_Python.ipynb',
        solutionsLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_2_Curso_Introductorio_de_Python.ipynb'
    }, {
        titleCode: 'PYTHONCOURSES.CLASSES.TITLE',
        descriptionCode: 'PYTHONCOURSES.CLASSES.C3',
        contentLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Clases/Clase_3_Introducción_a_la_Programación_con_Python.ipynb',
        solutionsLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-Python/blob/master/Curso_Introductorio_Solucionarios/Solucionario_Clase_3_Curso_Introductorio_de_Python.ipynb'
    }],
    [IeeeEvent.DATA_ANALYSIS]: [{
        titleCode: 'DATAANALYSIS.CLASSES.TITLE',
        descriptionCode: 'DATAANALYSIS.CLASSES.C1',
        contentLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_1_Analisis_de_Datos.ipynb',
        solutionsLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_1.ipynb',
    }, {
        titleCode: 'DATAANALYSIS.CLASSES.TITLE',
        descriptionCode: 'DATAANALYSIS.CLASSES.C2',
        contentLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Clases/Clase_2_Analisis_de_Datos.ipynb',
        solutionsLink: 'https://colab.research.google.com/github/IEEESBITBA/Curso-python/blob/master/Curso_Analisis_de_Datos_Solucionarios/Solucionario_Clase_2.ipynb'
    }],
    [IeeeEvent.TYPESCRIPT_COURSE]: [{
        titleCode: 'TYPESCRIPT.SYLLABUS.1.TEXT',
        descriptionCode: 'TYPESCRIPT.SYLLABUS.1.DESCRIPTION',
    }, {
        titleCode: 'TYPESCRIPT.SYLLABUS.2.TEXT',
        descriptionCode: 'TYPESCRIPT.SYLLABUS.2.DESCRIPTION',
    }, {
        titleCode: 'TYPESCRIPT.SYLLABUS.3.TEXT',
        descriptionCode: 'TYPESCRIPT.SYLLABUS.3.DESCRIPTION',
    }, {
        titleCode: 'TYPESCRIPT.SYLLABUS.4.TEXT',
        descriptionCode: 'TYPESCRIPT.SYLLABUS.4.DESCRIPTION',
    }],
}

export const migrateEventCourses = async () => {
    const batch = getFirestore().batch();
    for (const eventId of Object.keys(eventCourseClassesByEventId)) {
        const event = getFirestore().collection('events').doc(eventId);
        const course = eventCourseClassesByEventId[eventId];
        batch.update(event, { course });
    }
    await batch.commit();
}

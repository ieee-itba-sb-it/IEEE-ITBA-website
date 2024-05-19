import {IeeeEvent} from "../src/app/shared/models/event/event-card-data";
import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../src/app/secrets";

// Execute this script before any other script that updates the events collection

const events: Record<IeeeEvent, any> = {
    [IeeeEvent.BITCUP]: {
        "routerLink": "/bitcup",
        "imageSrc": "../../../../../assets/image/events/bitcup/bitcup-logo.jpeg",
        "imageAlt": "Foto de los cursos de Python",
        "titleCode": "HOME.BITCUP.TITLE",
        "descriptionCode": "HOME.BITCUP.TEXT",
        "isRasEvent": false,
        "dates": []
    },
    [IeeeEvent.PYTHON_COURSE]: {
        "routerLink": "/cursospython",
        "imageSrc": "../../../../../assets/image/events/python-introductory/cursopython.jpg",
        "imageAlt": "Foto de los cursos de Python",
        "titleCode": "HOME.CLASSES.TITLE",
        "descriptionCode": "HOME.CLASSES.TEXT",
        "isRasEvent": false,
        "dates": [
            {
                "showMonth": true,
                "showYear": true,
                "date": "2024-04-01",
                "descriptionCode": "EVENTCARD.DATE.TBD"
            }
        ]
    },
    [IeeeEvent.IOT_WORKSHOP]: {
        "routerLink": "/iot",
        "imageSrc": "../../../../../assets/image/events/iot/iot-banner.jpeg",
        "imageAlt": "Logo de la Asimov Cup",
        "titleCode": "HOME.IOT.TITLE",
        "descriptionCode": "HOME.IOT.TEXT",
        "isRasEvent": false,
        "dates": [{
            "date": "2023-11-01",
            "descriptionCode": ""
        }]
    },
    [IeeeEvent.TYPESCRIPT_COURSE]: {
        "routerLink": "/curso-typescript",
        "imageSrc": "../../../../../assets/image/events/typescript-course/banner.jpg",
        "imageAlt": "Foto de curso de Typescript",
        "titleCode": "TYPESCRIPT.TITLE",
        "descriptionCode": "TYPESCRIPT.DESCRIPTION.TEXT",
        "isRasEvent": false,
        "dates": [{
            "showMonth": true,
            "showYear": true,
            "date": "2024-05-01",
            "descriptionCode": ""
        }]
    },
    [IeeeEvent.DATA_ANALYSIS]: {
        "routerLink": "/data-analysis",
        "imageSrc": "../../../../../assets/image/events/data-analysis/data-analysis-event.png",
        "imageAlt": "Foto de curso analisis de datos",
        "titleCode": "HOME.DATAANALYSIS.TITLE",
        "descriptionCode": "HOME.DATAANALYSIS.TEXT",
        "isRasEvent": false,
        "dates": [
            {
                "showMonth": true,
                "showYear": true,
                "date": "2024-08-01",
                "descriptionCode": ""
            }
        ]
    },
    [IeeeEvent.ASIMOV_CUP]: {
        "routerLink": "/asimovcup",
        "imageSrc": "../../../../../assets/image/events/asimov-cup/asimov-cup-logo.png",
        "imageAlt": "Logo de la Asimov Cup",
        "titleCode": "HOME.ASIMOVCUP.TITLE",
        "descriptionCode": "HOME.ASIMOVCUP.TEXT",
        "isRasEvent": true,
        "dates": [
            {
                "showMonth": true,
                "showYear": true,
                "date": "2024-07-03",
                "descriptionCode": ""
            }
        ]
    },
    [IeeeEvent.IEEE_EXTREME]: {
        "routerLink": "/ieeextreme",
        "imageSrc": "../../../../../assets/image/events/ieeextreme/ieee-extreme.jpg",
        "imageAlt": "Foto de competicion IEEExtreme",
        "titleCode": "HOME.IEEEXTREME.TITLE",
        "descriptionCode": "HOME.IEEEXTREME.TEXT",
        "isRasEvent": false,
        "dates": [
            {
                "showMonth": true,
                "showYear": true,
                "date": "2024-09-01",
                "descriptionCode": "EVENTCARD.DATE.TBD"
            }
        ]
    }
};

export const createEventInitialSchema = async () => {
    const eventsCollection = getFirestore().collection(eventsCollectionName);
    const batch = getFirestore().batch();
    Object.entries(events).forEach(([id, event]) => {
        batch.set(eventsCollection.doc(id), event);
    });
    await batch.commit();
}

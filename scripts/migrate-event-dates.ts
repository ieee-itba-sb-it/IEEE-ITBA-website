import {applicationDefault, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../src/app/secrets";
import {EventDate, EventDoc, EventStatus} from "../src/app/shared/models/event/event";

initializeApp({
    credential: applicationDefault(),
});

interface OldDate {
    date?: `${number}-${number}-${number}`
    descriptionCode?: string;
    showMonth?: boolean;
    showYear?: boolean;
}

const mapOldDateToNewDates = (dates?: OldDate[]): EventDoc['dates'] => {
    const date = dates?.[0]?.date;
    if (date) {
        return {
            [EventDate.OPENING]: {
                status: EventStatus.CONFIRMED,
                date
            }
        }
    }
    return {
        [EventDate.OPENING]: {
            status: EventStatus.UNSCHEDULED
        }
    }
}

export const migrateEventDates = async () => {
    const eventsCollection = getFirestore().collection(eventsCollectionName);
    const events = (await eventsCollection.get()).docs;
    const batch = getFirestore().batch();
    events.forEach(event => {
        const data = event.data();
        const dates = mapOldDateToNewDates(data.dates);
        batch.update(event.ref, {
            dates
        });
    });
    await batch.commit();
}

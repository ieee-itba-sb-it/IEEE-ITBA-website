import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../src/app/secrets";
import {EventDate, EventDoc, EventStatus} from "../src/app/shared/models/event/event";

interface OldDate {
    date?: `${number}-${number}-${number}`
    descriptionCode?: string;
    showMonth?: boolean;
    showYear?: boolean;
}

const mapOldDateToNewDates = (dates?: OldDate[]) => {
    const date = dates?.[0]?.date;
    if (date) {
        return {
            OPENING: {
                status: EventStatus.CONFIRMED,
                date
            }
        }
    }
    return {
        OPENING: {
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

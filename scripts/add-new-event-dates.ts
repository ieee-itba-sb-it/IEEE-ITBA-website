import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../src/app/secrets";
import {EventDoc, EventStatus, sortedEventDates} from "../src/app/shared/models/event/event";

const addMissingEventDates = (dates: EventDoc['dates']): EventDoc['dates'] => {
    const out: EventDoc['dates'] = {...dates};
    for (const eventDate of sortedEventDates) {
        if (!out[eventDate]) {
            out[eventDate] = {
                status: EventStatus.UNSCHEDULED
            };
        }
    }
    return out;
}

export const addNewEventDates = async () => {
    const eventsCollection = getFirestore().collection(eventsCollectionName);
    const events = (await eventsCollection.get()).docs;
    const batch = getFirestore().batch();
    events.forEach(event => {
        const data = event.data();
        const dates = addMissingEventDates(data.dates);
        batch.update(event.ref, {
            dates
        });
    });
    await batch.commit();
}

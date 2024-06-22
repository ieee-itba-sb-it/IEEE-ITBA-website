import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../../src/app/secrets";
import {EventDate, EventDoc, EventStatus, sortedEventDates} from "../../src/app/shared/models/event/event";

const updateEventDates = (dates): EventDoc['dates'] => {
    const out: EventDoc['dates'] = {} as EventDoc['dates'];
    const openingDate = dates?.OPENING;
    if (openingDate) {
        out[EventDate.EVENT] = {
            ...openingDate,
        }
    }
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
        const dates = updateEventDates(data.dates);
        batch.update(event.ref, {
            dates
        });
    });
    await batch.commit();
}

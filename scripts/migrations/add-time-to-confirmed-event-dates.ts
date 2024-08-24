import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../../src/app/secrets";
import {Event, EventStatus} from "../../src/app/shared/models/event/event";

const updateConfirmedEventDates = (event: Event): Event['dates'] => {
    const out: Event['dates'] = {} as Event['dates'];
    for (const eventDate of Object.keys(event.dates)) {
        out[eventDate] = {
            ...event.dates[eventDate]
        }
        if (out[eventDate].status === EventStatus.CONFIRMED && !out[eventDate].time) {
            out[eventDate].time = "12:00";
        }
    }
    return out;
}

export const addTimeToConfirmedEventDates = async () => {
    const eventsCollection = getFirestore().collection(eventsCollectionName);
    const events = (await eventsCollection.get()).docs;
    const batch = getFirestore().batch();
    events.forEach(event => {
        const data = event.data() as Event;
        const dates = updateConfirmedEventDates(data);
        batch.update(event.ref, {
            dates
        });
    });
    await batch.commit();
}

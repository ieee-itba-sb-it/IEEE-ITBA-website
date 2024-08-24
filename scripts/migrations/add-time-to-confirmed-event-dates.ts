import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../../src/app/secrets";
import {EventDoc, EventStatus} from "../../src/app/shared/models/event/event";

const updateConfirmedEventDates = (event: EventDoc): EventDoc['dates'] => {
    const out: EventDoc['dates'] = {} as EventDoc['dates'];
    for (const eventDate of Object.keys(event.dates)) {
        out[eventDate] = {
            ...event.dates[eventDate]
        }
        if (out[eventDate].status === EventStatus.CONFIRMED) {
            out[eventDate].time = out[eventDate].time ?? '12:00';
            if (out[eventDate].lastDate) {
                out[eventDate].lastTime = out[eventDate].lastTime ?? '12:00';
            }
        }
    }
    return out;
}

export const addTimeToConfirmedEventDates = async () => {
    const eventsCollection = getFirestore().collection(eventsCollectionName);
    const events = (await eventsCollection.get()).docs;
    const batch = getFirestore().batch();
    events.forEach(event => {
        const data = event.data() as EventDoc;
        const dates = updateConfirmedEventDates(data);
        batch.update(event.ref, {
            dates
        });
    });
    await batch.commit();
}

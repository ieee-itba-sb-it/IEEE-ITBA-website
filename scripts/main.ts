import {initializeApp} from "firebase-admin/app";
import {addTimeToConfirmedEventDates} from "./migrations/add-time-to-confirmed-event-dates";
import { migrateFullnames } from "./migrate-fullnames";
import {migrateEventCourses} from "./migrations/migrate-event-courses";

//  export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json" Prod
// export FIREBASE_AUTH_EMULATOR_HOST='localhost:9099' for local
process.env.FIREBASE_AUTH_EMULATOR_HOST='localhost:9099'
// export FIRESTORE_EMULATOR_HOST='localhost:8080' for local
process.env.FIRESTORE_EMULATOR_HOST='localhost:8080'
initializeApp({
    projectId: 'ieeeitba'
});

async function main() {
    await migrateFullnames();
    await addTimeToConfirmedEventDates();
    await migrateEventCourses();
}

main();

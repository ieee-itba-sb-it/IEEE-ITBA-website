import {createEventInitialSchema} from "./migrations/create-event-initial-schema";
import {initializeApp} from "firebase-admin/app";
import {migrateEventDates} from "./migrations/migrate-event-dates";
import {addNewEventDates} from "./migrations/add-new-event-dates";

//  export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json" Prod
// export FIREBASE_AUTH_EMULATOR_HOST='localhost:9099' for local
// export FIRESTORE_EMULATOR_HOST='localhost:8080' for local
initializeApp({
    projectId: 'ieeeitba'
});

async function main() {
    await createEventInitialSchema();
    await migrateEventDates();
    await addNewEventDates();
}

main();

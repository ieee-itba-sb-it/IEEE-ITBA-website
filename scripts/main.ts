import {generateMissingUsers} from "./clean-unauthenticated";
import {createEventInitialSchema} from "./create-event-initial-schema";
import {initializeApp} from "firebase-admin/app";

//  export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json" Prod
// export FIREBASE_AUTH_EMULATOR_HOST='localhost:9099' for local
// export FIRESTORE_EMULATOR_HOST='localhost:8080' for local
initializeApp({
    projectId: 'ieeeitba'
});

function main() {
    createEventInitialSchema();
}

main();

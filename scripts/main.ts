import {initializeApp} from "firebase-admin/app";
import { migrateFullnames } from "./migrate-fullnames";

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
}

main();

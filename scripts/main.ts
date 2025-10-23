import {initializeApp} from "firebase-admin/app";
import { saveDocs } from "./migrations/upload_docs";
import {migrateGenderTitles} from "./migrations/migrate-gender-titles";
import {scrapingIeeextreme} from "./extreme/rankingScraper";

// USO EN PROD (Descomentar)
// WINDOWS
// process.env.GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json"
// LINUX
// export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json"

// USO EN LOCAL (Descomentar el correspondiente)
// WINDOWS
process.env.FIREBASE_AUTH_EMULATOR_HOST='localhost:9099'
process.env.FIRESTORE_EMULATOR_HOST='localhost:8080'
// LINUX
// export FIREBASE_AUTH_EMULATOR_HOST='localhost:9099' for local
// export FIRESTORE_EMULATOR_HOST='localhost:8080' for local

initializeApp({
    projectId: 'ieeeitba'
});

async function main() {
    await scrapingIeeextreme();
}

main();

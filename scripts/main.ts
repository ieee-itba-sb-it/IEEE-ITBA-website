import {initializeApp} from "firebase-admin/app";
import {migrateNewsToNewFormat} from "./migrations/migrate-news-to-new-format";

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
    // Ejecutar migración de noticias al nuevo formato
    await migrateNewsToNewFormat();
}

main();

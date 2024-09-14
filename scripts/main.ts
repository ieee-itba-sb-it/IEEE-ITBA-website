import {initializeApp} from "firebase-admin/app";
import {multipleRoleMigration} from "./migrations/multiple-role-support";

//  export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json" Prod

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
    await multipleRoleMigration();
}

main();

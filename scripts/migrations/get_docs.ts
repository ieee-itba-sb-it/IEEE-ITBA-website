import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as fs from "node:fs";


const collections = [
    'blog-entries',
    'collection-metadata',
    'commissions',
    'events',
];
// Downloads the collections in firestore and saves them to a file named docs.json.
export async function getDocs() {
    const firestore = getFirestore();
    const savedDocs: Record<string, unknown[]> = {};
    for (const collectionName of collections) {
        const collection = firestore.collection(collectionName);
        const docs = await collection.get();
        console.log(`Collection: ${collectionName}`);
        savedDocs[collectionName] = [];

        docs.forEach(doc => {
            const data = doc.data();
            savedDocs[collectionName].push({
                id: doc.id,
                ...data
            });
        });
    }
    fs.writeFileSync('docs.json', JSON.stringify(savedDocs, null, 2), 'utf-8');
}

import { getFirestore, CollectionReference, DocumentReference } from 'firebase-admin/firestore';

/*
**  The main purpose of this script is to clean up previous Asimov predictions data
**  which are no longer needed and occupies scarce database disk memory.
 */

const COLLECTIONS_TO_DELETE = [
    'asimov-encounters',
    'asimov-robots',
    'asimov-scores',
];

const BATCH_SIZE = 400;

async function deleteDocumentRecursively(docRef: DocumentReference): Promise<void> {
    const subCollections = await docRef.listCollections();
    for (const subCol of subCollections) {
        await deleteCollectionRecursively(subCol);
    }
    await docRef.delete();
}

async function deleteCollectionRecursively(collectionRef: CollectionReference): Promise<void> {
    let totalDeleted = 0;

    while (true) {
        const snapshot = await collectionRef.limit(BATCH_SIZE).get();
        if (snapshot.empty) break;

        for (const doc of snapshot.docs) {
            await deleteDocumentRecursively(doc.ref);
            totalDeleted++;
        }

    }
}

export async function deleteAsimovCollections(): Promise<void> {
    const db = getFirestore();

    for (const collectionPath of COLLECTIONS_TO_DELETE) {
        await deleteCollectionRecursively(db.collection(collectionPath));
    }
}

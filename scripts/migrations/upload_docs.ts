import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as fs from "node:fs";
import docs from '../docs.json';

// Shallow copy of the docs.json file to avoid modifying the original file. The data must be in a docs.json.
// The json file is obtained using the get_docs script.
export async function saveDocs() {
    const firestore = getFirestore();
    Object.entries(docs).forEach(([key, value]) => {
        value.forEach(({ id, ...data }) => {
            firestore.collection(key).doc(id).set(parseData(data), {merge: true});
        })
    });
}

const parseData = (data: Record<string, unknown>) => {
    const newData = { ...data };
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && typeof value === "object" && value["_seconds"] && value["_nanoseconds"]) {
            newData[key] = new Date(value["_seconds"] * 1000 + value["_nanoseconds"] / 1000000);
        }
    });
    return newData;
}

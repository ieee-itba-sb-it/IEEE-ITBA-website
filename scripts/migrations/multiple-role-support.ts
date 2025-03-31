import { firestore } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { DocumentData } from "@angular/fire/firestore";
import { FieldValue } from 'firebase-admin/firestore';


export async function multipleRoleMigration() {
    const userCollection = getFirestore().collection("users");
    const sensitiveDataCollection = getFirestore().collection("sensitive-user-data");
    let users = (await userCollection.get()).docs;
    let sensitiveData = (await sensitiveDataCollection.get()).docs;
    const batch = getFirestore().batch();
    users.forEach(user => changeDocRole(user, batch));
    sensitiveData.forEach(sensitiveUser => changeDocRole(sensitiveUser, batch));
    await batch.commit();
}

function changeDocRole(doc: firestore.QueryDocumentSnapshot, batch: firestore.WriteBatch) {
    let roles: number[] = [];
    let role = doc.data().role;
    if (doc.data().hasOwnProperty("roles")) {
        roles = doc.data().roles;
    } else if (doc.data().hasOwnProperty("role") && typeof role == "number" && role != 0) {
        roles.push(role);
    }
    batch.set<DocumentData, DocumentData>(doc.ref, {
        role: FieldValue.delete(),
        roles: roles
    }, {
        merge: true
    })
}

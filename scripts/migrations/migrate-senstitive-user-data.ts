import { getFirestore } from "firebase-admin/firestore";

export async function migrateRoles() {
    const userCollection = getFirestore().collection("users");
    const sensitiveDataCollection = getFirestore().collection("sensitive-user-data");
    let users = (await userCollection.get()).docs;
    let roleUsers = users.filter((user) => user.data().role && user.data().role != 0);
    if (roleUsers.length <= 0) return;
    const batch = getFirestore().batch();
    roleUsers.forEach(user => {
        const ref = sensitiveDataCollection.doc(user.data().email);
        batch.set(ref, {
            role: user.data().role
        }, {
            merge: true
        });
    });
    await batch.commit();
}

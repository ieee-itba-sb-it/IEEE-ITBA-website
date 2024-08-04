import { getFirestore } from "firebase-admin/firestore";

export async function migrateFullnames() {
    const userCollection = getFirestore().collection("users");
    let users = (await userCollection.get()).docs;
    let roleUsers = users.filter((user) => !user.data().fullname);
    if (roleUsers.length <= 0) return;
    const batch = getFirestore().batch();
    roleUsers.forEach(user => {
        const ref = userCollection.doc(user.data().email);
        batch.set(ref, {
            fullname: `${user.data().fname} ${user.data().lname}`
        }, {
            merge: true
        });
    });
    await batch.commit();
}

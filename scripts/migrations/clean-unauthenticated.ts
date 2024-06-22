import {getAuth, UserRecord} from 'firebase-admin/auth';
import { getFirestore } from "firebase-admin/firestore";

export async function generateMissingUsers() {
    const userCollection = getFirestore().collection("users");
    const users = await listUsers();
    const existentUsers = await Promise.all(users.map(async (user) => {
        const doc = await userCollection.doc(user.email).get()
        return {
            exists: doc.exists,
            user,
        };
    }));
    const incorrectUsers = existentUsers.filter((user) => {
        return !user.exists;
    });
    const batch = getFirestore().batch();
    incorrectUsers.forEach(({ user }) => {
        const ref = userCollection.doc(user.email);
        batch.set(ref, {
            email: user.email,
            fname: user.email.split('@')[0],
            lname: '',
            photoURL: '',
            role: 0,
            uID: user.uid
        });
    });
    await batch.commit();
}



async function listUsers(users: UserRecord[] = [], next: string | undefined = undefined): Promise<UserRecord[]> {
    const listUsersResult = await getAuth()
        .listUsers(1000, next);
    listUsersResult.users.forEach((userRecord) => {
        users.push(userRecord);
    });
    if (listUsersResult.pageToken) {
        // List next batch of users.
        return listUsers(users, listUsersResult.pageToken);
    }
    return users;
}

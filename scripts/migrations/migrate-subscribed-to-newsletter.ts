import { getFirestore } from "firebase-admin/firestore";

export const migrateSubscribedToNewsletter = async () => {
    const usersCollection = getFirestore().collection("users");
    const users = (await usersCollection.get()).docs;
    const batch = getFirestore().batch();
    let updatedCount = 0;

    users.forEach(userDoc => {
        const data = userDoc.data();
        if (data.subscribedToNewsletter === undefined || data.subscribedToNewsletter === null) {
            batch.update(userDoc.ref, { subscribedToNewsletter: false });
            updatedCount++;
        }
    });

    if (updatedCount > 0) {
        await batch.commit();
        console.log(`Successfully migrated ${updatedCount} users to subscribedToNewsletter: false.`);
    } else {
        console.log("No users found needing subscribedToNewsletter migration.");
    }
};

import { getFirestore } from "firebase-admin/firestore";

export const migrateGenderTitles = async () => {
    const commissionsCollection = getFirestore().collection("commissions");
    const commissions = (await commissionsCollection.get()).docs;
    const batch = getFirestore().batch();
    commissions.forEach(commission => {
        const data = commission.data() as any;
        data.positions.forEach((position) => {
            if( position.title.es != null ) {
                position.title = {
                    M: {...position.title},
                    F: {...position.title}
                }
            }

        })
        batch.update(commission.ref, data);
    });
    await batch.commit();


}

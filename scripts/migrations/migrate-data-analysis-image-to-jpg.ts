import {getFirestore} from "firebase-admin/firestore";
import {eventsCollectionName} from "../../src/app/secrets";
import {IeeeEvent} from "../../src/app/shared/models/event/event";

const oldImageSrc = "../../../../../assets/image/events/data-analysis/data-analysis-event.png";
const newImageSrc = "../../../../../assets/image/events/data-analysis/data-analysis-event.jpg";

export const migrateDataAnalysisImageToJpg = async () => {
    const eventRef = getFirestore().collection(eventsCollectionName).doc(IeeeEvent.DATA_ANALYSIS);
    const event = await eventRef.get();
    const imageSrc = event.data()?.imageSrc;
    if (imageSrc !== oldImageSrc) {
        console.log(`Skipping ${IeeeEvent.DATA_ANALYSIS}: imageSrc is "${imageSrc}"`);
        return;
    }
    await eventRef.update({imageSrc: newImageSrc});
    console.log(`Updated ${IeeeEvent.DATA_ANALYSIS} imageSrc to "${newImageSrc}"`);
}

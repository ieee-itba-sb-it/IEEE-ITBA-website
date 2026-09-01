import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { SenderClient } from "../sender/sender-client";
import { generateNewsAnnouncementHtml } from "../templates/news-announcement";

export async function processNewsAnnouncement(
  reference: string,
  afterData: any
): Promise<{ processed: boolean; reason?: string; sentCount?: number }> {
  if (!afterData) {
    return { processed: false, reason: "Document deleted" };
  }

  // Check if article is listed/public
  if (afterData.listed !== true) {
    logger.info(`Article ${reference} is not listed (draft), skipping newsletter.`);
    return { processed: false, reason: "Article not listed" };
  }

  // Guard against duplicate emails on edit
  if (afterData.newsletterSentAt) {
    logger.info(
      `Article ${reference} already sent newsletter at ${afterData.newsletterSentAt}, skipping.`
    );
    return { processed: false, reason: "Newsletter already sent" };
  }

  logger.info(`Processing automatic newsletter dispatch for news article: ${reference}`);

  const senderClient = new SenderClient();
  const db = admin.firestore();

  // Query subscribed users
  const subscribersSnap = await db
    .collection("users")
    .where("subscribedToNewsletter", "==", true)
    .get();

  if (subscribersSnap.empty) {
    logger.info("No subscribed users found in Firestore.");
    // Mark as processed anyway so we don't re-query continuously
    await db.collection("blog-entries").doc(reference).update({
      newsletterSentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { processed: true, sentCount: 0 };
  }

  const emailHtml = generateNewsAnnouncementHtml({
    title: afterData.title || "Nueva noticia en IEEE ITBA",
    content: afterData.content || "",
    imageUrl: afterData.imageUrl || "",
    reference,
    author: afterData.author || "IEEE ITBA",
  });

  const subject = `[IEEE ITBA] ${afterData.title || "Nueva Noticia Publicada"}`;
  let successCount = 0;

  for (const userDoc of subscribersSnap.docs) {
    const userData = userDoc.data();
    const userEmail = userData.email || userDoc.id;
    if (userEmail) {
      const result = await senderClient.sendEmail(userEmail, subject, emailHtml);
      if (result.success) {
        successCount++;
      }
    }
  }

  // Update document with sent timestamp to prevent duplicate sends
  await db.collection("blog-entries").doc(reference).update({
    newsletterSentAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`Newsletter sent successfully to ${successCount} subscribers for article ${reference}`);
  return { processed: true, sentCount: successCount };
}

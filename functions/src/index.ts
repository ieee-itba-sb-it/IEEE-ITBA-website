import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { SenderClient } from "./sender/sender-client";
import { processNewsAnnouncement } from "./mailing/send-news-announcement";

admin.initializeApp();

/**
 * Trigger: Sync user newsletter preference with Sender.net when users/{email} changes.
 */
export const onUserWritten = functions.firestore
  .document("users/{email}")
  .onWrite(async (change, context) => {
    const email = context.params.email;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    if (!afterData) {
      // User document deleted
      logger.info(`User document deleted: ${email}. Removing from Sender.net...`);
      const senderClient = new SenderClient();
      await senderClient.syncSubscriber(email, "", false);
      return;
    }

    const beforeSub = beforeData?.subscribedToNewsletter ?? false;
    const afterSub = afterData?.subscribedToNewsletter ?? false;
    const fullname = afterData.fullname || "";

    // Sync if preference changed or if user document was newly created
    if (!beforeData || beforeSub !== afterSub) {
      logger.info(`Syncing newsletter preference for ${email}: ${afterSub}`);
      const senderClient = new SenderClient();
      await senderClient.syncSubscriber(email, fullname, afterSub);
    }
  });

/**
 * Trigger: Automatically send newsletter email when a news article is published in blog-entries/{reference}.
 */
export const onBlogEntryWritten = functions.firestore
  .document("blog-entries/{reference}")
  .onWrite(async (change, context) => {
    const reference = context.params.reference;
    const afterData = change.after.exists ? change.after.data() : null;

    if (!afterData) {
      return;
    }

    await processNewsAnnouncement(reference, afterData);
  });

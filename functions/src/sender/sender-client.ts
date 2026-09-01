import axios from "axios";
import * as logger from "firebase-functions/logger";

const SENDER_API_BASE_URL = "https://api.sender.net/v1";

export class SenderClient {
  private getApiKey(): string | null {
    const apiKey = process.env.SENDER_API_KEY;
    if (!apiKey) {
      logger.warn("SENDER_API_KEY is not configured in environment/secrets.");
      return null;
    }
    return apiKey;
  }

  private getHeaders(apiKey: string) {
    return {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  /**
   * Synchronize user newsletter subscription state with Sender.net
   */
  async syncSubscriber(
    email: string,
    fullname: string,
    subscribedToNewsletter: boolean
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      logger.info(
        `[Sender API Mock] Skipping subscriber sync for ${email} (subscribed: ${subscribedToNewsletter}) - SENDER_API_KEY missing.`
      );
      return { success: true, data: { mock: true } };
    }

    const nameParts = (fullname || "").trim().split(" ");
    const firstname = nameParts[0] || "";
    const lastname = nameParts.slice(1).join(" ") || "";

    try {
      if (subscribedToNewsletter) {
        // Add or update subscriber on Sender.net
        logger.info(`Adding/updating subscriber ${email} on Sender.net...`);
        const response = await axios.post(
          `${SENDER_API_BASE_URL}/subscribers`,
          {
            email,
            firstname,
            lastname,
            trigger_automation: false,
          },
          { headers: this.getHeaders(apiKey) }
        );
        return { success: true, data: response.data };
      } else {
        // Unsubscribe or delete subscriber on Sender.net
        logger.info(`Unsubscribing/removing subscriber ${email} on Sender.net...`);
        try {
          const response = await axios.delete(
            `${SENDER_API_BASE_URL}/subscribers/${encodeURIComponent(email)}`,
            { headers: this.getHeaders(apiKey) }
          );
          return { success: true, data: response.data };
        } catch (delError: any) {
          // If DELETE returns 404, fallback to unsubscribe endpoint
          if (delError.response && delError.response.status === 404) {
            logger.info(`Subscriber ${email} not found on delete, ignoring 404.`);
            return { success: true, data: { notFound: true } };
          }
          throw delError;
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      logger.error(
        `Error syncing subscriber ${email} with Sender.net:`,
        error.response?.data || error
      );
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Send a transactional / broadcast email to a subscriber via Sender.net
   */
  async sendEmail(
    toEmail: string,
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      logger.info(
        `[Sender API Mock] Skipping email send to ${toEmail} with subject "${subject}" - SENDER_API_KEY missing.`
      );
      return { success: true, data: { mock: true } };
    }

    try {
      const response = await axios.post(
        `${SENDER_API_BASE_URL}/messages/send`,
        {
          to: toEmail,
          subject,
          html: htmlContent,
        },
        { headers: this.getHeaders(apiKey) }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      logger.error(
        `Error sending email to ${toEmail} via Sender.net:`,
        error.response?.data || error
      );
      return { success: false, error: errorMsg };
    }
  }
}

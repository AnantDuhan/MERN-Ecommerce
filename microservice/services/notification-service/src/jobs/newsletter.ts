import ejs from "ejs";
import path from "path";
import { createLogger } from "@order-planning/shared";
import { config } from "../config";
import { Subscribe } from "../models/subscribe";
import { sendEmail } from "../email/sendEmail";

const log = createLogger("notification-service");

/**
 * Ported from the monolith's newsletterJob.js. One change worth noting: the
 * monolith read Product directly to feature recent items. Notifications no
 * longer owns product data, so in the full build this pulls featured products
 * from catalog-service over the gateway (or from a projection kept up to date
 * by ProductCreated/Updated events). Left as a typed seam here.
 */
async function fetchFeaturedProducts(): Promise<Array<{ name: string; price: number }>> {
  // TODO(order-service extraction): GET {CATALOG_SERVICE_URL}/api/v1/products?featured=true
  return [];
}

export async function runWeeklyNewsletter(): Promise<void> {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const subscribers = await Subscribe.find({
    unsubscribedAt: null,
    $or: [{ lastNewsletterSentAt: null }, { lastNewsletterSentAt: { $lte: cutoff } }],
  });
  if (!subscribers.length) return;

  const products = await fetchFeaturedProducts();

  for (const subscriber of subscribers) {
    try {
      const html = await ejs.renderFile(
        path.join(__dirname, "..", "..", "mails", "newsletter-weekly.ejs"),
        {
          products,
          frontendUrl: config.frontendUrl,
          unsubscribeUrl: `${config.frontendUrl}/api/v1/unsubscribe/${subscriber.unsubscribeToken}`,
        },
      );
      await sendEmail({
        email: subscriber.email,
        subject: "The Maison Journal · This week at Maison",
        html,
      });
      await Subscribe.updateOne(
        { _id: subscriber._id },
        { lastNewsletterSentAt: new Date() },
      );
    } catch (error) {
      log.error(
        { email: subscriber.email, err: (error as Error).message },
        "newsletter delivery failed",
      );
    }
  }
}

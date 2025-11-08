import { json } from "@remix-run/node";
import crypto from "crypto";

export async function action({ request }) {
  // Get the raw body and headers
  const rawBody = await request.text();
  const hmac = request.headers.get("x-shopify-hmac-sha256");

  if (!hmac) {
    return json({ message: "Missing HMAC header" }, { status: 401 });
  }

  // Get your app's client secret from environment variables
  const clientSecret = process.env.SHOPIFY_API_SECRET;

  // Calculate HMAC
  const calculatedHmac = crypto
    .createHmac("sha256", clientSecret)
    .update(rawBody)
    .digest("base64");

  // Verify HMAC
  const isValid = crypto.timingSafeEqual(
    Buffer.from(calculatedHmac, "base64"),
    Buffer.from(hmac, "base64")
  );

  if (!isValid) {
    return json({ message: "HMAC validation failed" }, { status: 401 });
  }

  // Process the webhook if HMAC is valid
  const webhookBody = JSON.parse(rawBody);

  // Handle the webhook data here
  console.log("Webhook received:", webhookBody);

  return json({ message: "Webhook processed successfully" });
}
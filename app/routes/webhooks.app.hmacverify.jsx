import { authenticate } from "../../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop, topic, payload } = await authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`, payload);
    // Handle shop/redact payload here (or forward to your existing handler)
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Invalid webhook", { status: 401 });
  }
};
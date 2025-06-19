import { authenticate } from "../shopify.server";
import { sessionModel } from "../model/sessionmodel";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

console.log("sessionModel",sessionModel);

  try {
    if (!sessionModel) {
      console.error("❌ sessionModel is undefined");
    } else {
      const result = await sessionModel.deleteMany({ shop });
      console.log(`✅ Deleted ${result.deletedCount} sessions for ${shop}`);
    }
  } catch (error) {
    console.error("❌ Deletion error:", error);
  }

  return new Response("OK");
};

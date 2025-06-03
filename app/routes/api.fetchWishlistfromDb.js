import { json } from "@remix-run/node";
import addToWishlistModel from "../model/add-wishlist-model";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);
    const url = new URL(request.url);
    const shopURL = url.searchParams.get("shopURL");
    const customerId = url.searchParams.get("customerId");
    const savedWishlistData = await addToWishlistModel.find({
      customerId
    });

   
    return json({ success: true, wishlistdata: savedWishlistData });
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    return json({ error: error }, { status: 500 });
  }
};

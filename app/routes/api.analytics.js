import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import addToWishlistModel from "../model/add-wishlist-model";

export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shopURL = session.shop
    console.log("🚀 ~ loader ~ shopURL:", shopURL)



  } catch (error) {
    return json({ success: false, error: error?.messsage }, { status: 500 });
  }
};



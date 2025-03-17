import { json } from "@remix-run/node";
import addToWishlistModel from "../model/add-wishlist-model";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);
    const url = new URL(request.url);
    console.log("🚀 ~ loader ~ url in saved:", url)
    const shopURL = url.searchParams.get("shopURL");
    console.log("🚀 ~ loader ~ shopURL:", shopURL)
    const savedWishlistData = await addToWishlistModel.find({
      shopURL,
    });
    console.log("🚀 ~ loader ~ savedWishlistData:", savedWishlistData);

    const wishListData = savedWishlistData.map((wishlist) => wishlist);
    console.log("🚀 ~ loader ~ wishListData:", wishListData);
    return json({ success: true, wishlistdata: wishListData });
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    return json({ error: error }, { status: 500 });
  }
};

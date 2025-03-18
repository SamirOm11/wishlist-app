import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import addToWishlistModel from "../model/add-wishlist-model";

export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);

    const url = new URL(request.url);
    console.log("🚀 ~ action ~ url:", url);
    const customerId = url.searchParams.get("customeId");
    const deleteType = url.searchParams.get("type");
    const productId = url.searchParams.get("productId");
    console.log("🚀 ~ action ~ productId:", productId);

    if (!customerId) {
      return json({ success: false, error: "Customer id not found" });
    }

    if (deleteType === "RemoveOne") {
      await addToWishlistModel.deleteOne({ productId });
    } else {
      await addToWishlistModel.deleteMany({
        customerId,
      });
    }

    return json(
      { success: true, message: "Wishlist succesfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.log("🚀 ~ action ~ error:", error);
    return json({ success: false }, { status: 500 });
  }
};

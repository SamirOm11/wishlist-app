import { request } from "http";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import addToWIshlistModel from "../model/add-wishlist-model";
import customerModel from "../model/customer.model";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.public.appProxy(request);

  try {
    const formData = await request.formData();
    console.log("Form Data: ", formData);

    const shopURL = formData.get("shopURL");
    const productId = formData.get("productId");
    const customerId = formData.get("customerId");
    console.log("🚀 ~ action ~ customerId:", customerId);

    let customer = await customerModel.findOne({ customerId, shopURL });
    if (!customer) {
      customer = new customerModel({
        customerId,
        shopURL
      });
      await customer.save();
    }

    const newWishlistItem = new addToWIshlistModel({
      productId,
      customerId,
      shopURL,
    });

    const SavedWishlistData = await newWishlistItem.save();
    console.log("Product added to wishlist");

    return json(
      { success: true, wishlistData: SavedWishlistData },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error: ", error);
    return json({ success: false, error: error?.message }, { status: 500 });
  }
};

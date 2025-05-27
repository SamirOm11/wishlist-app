import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import addToWishlistModel from "../model/add-wishlist-model";
import { productDetails as productDetailsQuery } from "../queries/graphql/productData";

export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);
    console.log("🚀 ~ loader ~ admin:", admin)
    const url = new URL(request.url);
    console.log("🚀 ~ loader ~ url:", url)
    const shopURL = url.searchParams.get("shopURL");
    const customerId = url.searchParams.get("customeId");
    console.log("🚀 ~ loader ~ customeId:", customerId)
    const wishlistData = await addToWishlistModel.find({  
      customerId
    });
    console.log("wishlistData", wishlistData);
    const productIds = wishlistData.map((item) => item.productId);
    console.log("productIds", productIds);
    const productResponse = await admin.graphql(productDetailsQuery, {
      variables: {
        productIds,
      },
    });
    console.log("productResponse", productResponse);

    const productData = await productResponse.json();
    console.log("productData", productData);
    const productDetailsArray = productData?.data?.nodes;
    console.log("productDetailsArray", productDetailsArray);
    return json({ success: true, wishlistData: productDetailsArray });
  } catch (error) {
    return json({ success: false, error: error?.message }, { status: 500 });
  }
};

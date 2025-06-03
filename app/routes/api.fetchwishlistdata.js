import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import addToWishlistModel from "../model/add-wishlist-model";
import { productDetails as productDetailsQuery } from "../queries/graphql/productData";
import { customer, customer as customerDetailsQuery } from "../queries/graphql/customerDetails";
export const loader = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const shopURL = session.shop;
    const customeDetails = await customer()
    const wishlistData = await addToWishlistModel.find({
      shopURL,
    });
    const productIds = wishlistData.map((item) => item.productId);
    const productResponse = await admin.graphql(productDetailsQuery, {
      variables: {
        productIds,
      },
    });

    const productData = await productResponse.json();
    const productDetailsArray = productData?.data?.nodes;

    // const customerIds = wishlistData.map((item) => item.customerId);
    // console.log("🚀 ~ loader ~ customerIds:", customerIds)
    // const customerResponse = await admin.graphql(customerDetailsQuery, {
    //   variables: { customerIds },
    // });
    // console.log("🚀 ~ loader ~ customerResponse:", customerResponse);
    
    // const customerData = customerResponse.data;
    // console.log("🚀 ~ loader ~ customerData:", customerData);
    
    
    return json({ success: true, wishlistData: productDetailsArray });
  } catch (error) {
    return json({ success: false, error: error?.message }, { status: 500 });
  }
};
  
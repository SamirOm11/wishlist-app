import mongoose from "mongoose";
import { authenticate } from "../shopify.server";

const at = "mywishlist";
export const loader = async ({ request, params }) => {
  try {
    const { liquid } = await authenticate.public.appProxy(request);
    // console.log(at, "review ID: ", params?.reviewId);
    // if (
    //   !params.reviewId ||
    //   params.reviewId === "undefined" ||
    //   params.reviewId === "null" ||
    //   params.reviewId === "NaN" ||
    //   !mongoose.isValidObjectId(params.reviewId)
    // ) {
    //   console.log(at, "Invalid review ID: ", params?.reviewId);
    //   return liquid(`
    //   <div>Invalid ID</div>
    // `);
    // }

    return liquid(`<div id="my-wishlist-page"></div>`);
  } catch (error) {
    console.log(at, "error: ", error);
    return null;
  }
};

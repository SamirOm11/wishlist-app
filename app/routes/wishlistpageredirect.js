import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }) => {
  try {
    const { liquid } = await authenticate.public.appProxy(request);

    return liquid(`<div id="product-wishlist-page"></div>`);
  } catch (error) {
    return null;
  }
};

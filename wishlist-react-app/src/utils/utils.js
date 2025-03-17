import axios from "axios";
export const addtoCart = async ({ wishlistProDucts }) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let items = [];

    const flatWishlist = wishlistProDucts.flat();
    console.log("🚀 ~ addtoCart ~ flatWishlist:", flatWishlist);

    items = flatWishlist.flatMap((product) => {
      if (product?.variants?.edges?.length) {
        return product.variants.edges.map((variant) => {
          const fullId = variant.node.id;

          // Extract numeric ID from the full "gid" format
          const numericId = fullId.split("/").pop(); // Get the last part after the last '/'

          // Check if the numericId exists and is valid
          if (!numericId) {
            console.error("Variant ID is missing", product);
          }

          return {
            id: numericId,
            quantity: 1,
          };
        });
      }
      return [];
    });

    console.log("Items to add to cart:", items);

    const res = await axios({
      url: "/cart/add.js",
      method: "POST",
      headers,
      data: { items },
    });

    if (res.status === 200) {
      console.log("Successfully added to cart");
      return { success: res.data };
    }
  } catch (error) {
    console.error("🚀 ~ addtoCart ~ error:", error);
    return { error };
  }
};

// export const fetchSavedWishlist = async ({shopURL}) => {
//   try {
//     const response = await fetch(`/apps/wishlist/api/fetchProductfromDb?shopURL=${shopURL}`);
//     const result = await response.json();
//     console.log("🚀 ~ fetchSavedWishlist ~ result:", result)
//     if (result) {
//       console.log("Product data successfully fetched.");
//     }
    
//   } catch (error) {
//     console.log("🚀 ~ fetchSavedWishlist ~ error:", error);
//   }
// };

import axios from "axios";

export const addtoCart = async ({ wishlistProDucts }) => {
  console.log("🚀 ~ addtoCart ~ wishlistProDucts:", wishlistProDucts);
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let items = [];

    items = wishlistProDucts.flatMap((product) => {
      if (product?.variants?.edges?.length) {
        return product.variants.edges.map((variant) => {
          const fullId = variant.node.id;
          console.log(
            "🚀 ~ returnproduct.variants.edges.map ~ fullId:",
            fullId,
          );

          const numericId = fullId.split("/").pop();
          console.log(
            "🚀 ~ returnproduct.variants.edges.map ~ numericId:",
            numericId,
          );

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

export const addAlltoCart = async ({ wishlistProDucts }) => {
  console.log("🚀 ~ addAlltoCart ~ wishlistProDucts:", wishlistProDucts);
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const items = wishlistProDucts.flatMap((product) => {
      console.log("🚀 ~ items=wishlistProDucts.flatMap ~ product:", product);

      if (product?.variants?.edges?.length) {
        return product.variants.edges
          .map((variant) => {
            const fullId = variant.node.id;
            const numericId = fullId.split("/").pop();

            if (!numericId) {
              return null;
            }

            return {
              id: numericId,
              quantity: 1,
            };
          })
          .filter(Boolean);
      }

      if (product?.id) {
        const fullId = product.id;
        const numericId = fullId.split("/").pop();
        if (numericId) {
          return [
            {
              id: numericId,
              quantity: 1,
            },
          ];
        }
      }

      return [];
    });
    console.log("items", items);

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
    console.log("🚀 ~ addAlltoCart ~ error:", error);
    return { error };
  }
};


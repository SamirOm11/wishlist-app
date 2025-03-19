import React from "react";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const ProductCardWishlistButton = () => {
  const [productCardNodes, setProductCardNodes] = useState([]);
  console.log(
    "🚀 ~ ProductCardWishlistButton ~ productCardNodes:",
    productCardNodes,
  );
  const [customProductCardButtons, setCustomProductCardButtons] = useState([]);
  console.log(
    "🚀 ~ ProductCardWishlistButton ~ customProductCardButtons:",
    customProductCardButtons,
  );
  const [productLinkNodes, setProductLinkNodes] = useState([]);
  console.log(
    "🚀 ~ ProductCardWishlistButton ~ productLinkNodes:",
    productLinkNodes,
  );
  const productLinkNodeSelector =
    ".card-wrapper .card > .card_content .card_information .card_heading a";
  const productCardWrapperSelector = ".grid_item .card-wrapper";
  console.log(
    "🚀 ~ ProductCardWishlistButton ~ productCardWrapperSelector:",
    productCardWrapperSelector,
  );

  useEffect(() => {
    const productCardNodesArray = document.querySelectorAll(
      productCardWrapperSelector,
    );
    console.log(
      "🚀 ~ useEffect ~ productCardNodesArray:",
      productCardNodesArray,
    );

    const productLinkElements = document.querySelectorAll(
      productLinkNodeSelector,
    );
    console.log("🚀 ~ useEffect ~ productLinkElements:", productLinkElements);
    let customProductcardButtonNodes = document.querySelectorAll(
      ".stensiled-wishlist-icon-button-custom-root",
    );
    console.log(
      "🚀 ~ useEffect ~ customProductcardButtonNodes:",
      customProductcardButtonNodes,
    );

    if (customProductcardButtonNodes?.length) {
      setCustomProductCardButtons(Array.from(customProductcardButtonNodes));
    }

    if (productCardNodesArray?.length) {
      setProductLinkNodes(Array.from(productLinkElements));
      setProductCardNodes(Array.from(productCardNodesArray));
    }
  }, []);

  return (
    <>
      {/* Collection page */}

      {window.ShopifyAnalytics.meta.page.pageType === "collection" &&
        !customProductCardButtons?.length &&
        productCardNodes?.length &&
        productCardNodes.map((productCardNode, index) => {
          const product = window.shopifyAnalytic?.meta?.products?.length
            ? window.shopifyAnalytic?.meta?.products[index]
            : null;
          const productGid = product ? product.gid : "";
          const productUrl = productLinkNodes[index].href;
          const selectedVariantId = product?.variants?.length
            ? product.variants[0]?.id
            : "";

          return createPortal(<h1>Samir</h1>, productCardNode);
        })}
        
    </>
  );
};

export default ProductCardWishlistButton;

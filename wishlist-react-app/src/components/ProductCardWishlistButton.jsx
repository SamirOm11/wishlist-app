import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { getCustomerid } from "../utils/lib";

const ProductCardWishlistButton = () => {
  const [wishlist, setWishlist] = useState([]);
  const [productCardNodes, setProductCardNodes] = useState([]);
  console.log(
    "🚀 ~ ProductCardWishlistButton ~ productCardNodes:",
    productCardNodes,
  );
  const [productLinkNodes, setProductLinkNodes] = useState([]);

  const customerId = getCustomerid();

  const productLinkNodeSelector =
    ".card-wrapper .card > .card__content .card__information .card__heading a";
  const productCardWrapperSelector = ".grid__item .card-wrapper";

  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await fetch(
        `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
      );
      const result = await response.json();
      console.log("🚀 ~ fetchWishlist ~ result:", result);

      setWishlist(result.wishlistdata);
    };

    fetchWishlist();
  }, []);

  useEffect(() => {
    const productCardNodesArray = document.querySelectorAll(
      productCardWrapperSelector,
    );
    const productLinkElements = document.querySelectorAll(
      productLinkNodeSelector,
    );
    setProductCardNodes(Array.from(productCardNodesArray));
    setProductLinkNodes(Array.from(productLinkElements));
  }, []);

  const handleWishlistToggle = async (
    productId,
    productName,
    productUrl,
    RemoveOne = "RemoveOne",
  ) => {
    const isProductInWishlist = wishlist.some(
      (item) => item.productId === productId,
    );

    const shopURL = window.location.host;
    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", productId);
    formDataToSend.append("customerId", customerId);

    try {
      if (isProductInWishlist) {
        await fetch(
          `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=${RemoveOne}&productId=${productId}`,
          {
            method: "POST",
            body: formDataToSend,
          },
        );

        setWishlist((prev) =>
          prev.filter((item) => item.productId !== productId),
        );
      } else {
        // Add product to wishlist
        await fetch("/apps/wishlist/api/savewishlist", {
          method: "POST",
          body: formDataToSend,
        });

        setWishlist((prev) => [
          ...prev,
          { productId, productName, productUrl },
        ]);
      }
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
  };

  return (
    <>
      {productCardNodes?.length &&
        productCardNodes.map((productCardNode, index) => {
          const product = window.ShopifyAnalytics?.meta?.products?.length
            ? window.ShopifyAnalytics?.meta?.products[index]
            : null;
          console.log("product", product);
          const productId = product ? product.gid : "";
          console.log("productId", productId);
          const productUrl = productLinkNodes[index].href;
          const isProductInWishlist = wishlist.some(
            (item) => item.productId === productId,
          );
          console.log(
            "🚀 ~ ProductCardWishlistButton ~ isProductInWishlist:",
            isProductInWishlist,
          );

          return createPortal(
            <div
              key={productId}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
              }}
            >
              <IconButton
                sx={{ fontSize: "20px" }}
                onClick={() =>
                  handleWishlistToggle(productId, product?.name, productUrl)
                }
                style={{ color: isProductInWishlist ? "red" : "grey" }}
                aria-label={
                  isProductInWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                {isProductInWishlist ? (
                  <Favorite sx={{ fontSize: "x-large" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "x-large" }} />
                )}
              </IconButton>
            </div>,
            productCardNode,
          );
        })}

      {/* For Home Page */}
      {window.ShopifyAnalytics.meta.page.pageType === "home" &&
        productCardNodes.map((productCardNode, index) => {
          let productGid = "";
          const idSplitArray =
            productLinkNodes[index].parentElement.id.split("-");
          const id = idSplitArray[idSplitArray.length - 1];
          if (id) productGid = "gid://shopify/Product/" + id;
          else {
            return null;
          }

          const productUrl = productLinkNodes[index].href;
          const selectedVariantId = "";
          const isProductInWishlist = wishlist.some(
            (item) => item.productId === productGid,
          );
          console.log(
            "🚀 ~ ProductCardWishlistButton ~ isProductInWishlist:",
            isProductInWishlist,
          );

          return createPortal(
            <div
              key={productGid}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
              }}
            >
              <IconButton
                sx={{ fontSize: "20px" }}
                onClick={() => handleWishlistToggle(productGid, productUrl)}
                style={{ color: isProductInWishlist ? "red" : "grey" }}
                aria-label={
                  isProductInWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                {isProductInWishlist ? (
                  <Favorite sx={{ fontSize: "x-large" }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: "x-large" }} />
                )}
              </IconButton>
            </div>,
            productCardNode,
          );
        })}
    </>
  );
};

export default ProductCardWishlistButton;

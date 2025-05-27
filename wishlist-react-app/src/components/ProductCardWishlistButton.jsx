import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { getCustomerid } from "../lib/lib";
import { NotificationAlert } from "./NotificationAlert";
import { useWishlist } from "./WishlistContext";

const ProductCardWishlistButton = () => {
  const [wishlist, setWishlist] = useState([]);
  const [productCardNodes, setProductCardNodes] = useState([]);
  console.log("productCardNodes", productCardNodes);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [productLinkNodes, setProductLinkNodes] = useState([]);
  const customerId = getCustomerid();
  const productLinkNodeSelector =
    ".card-wrapper .card > .card__content .card__information .card__heading a";
  const productCardWrapperSelector = ".grid__item .card-wrapper";
  const { setWishlistCount } = useWishlist();
  setWishlistCount(wishlist.length);

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
    console.log("productId---", productId);
    if (!customerId) {
      setMessage("Please login to use the wishlist");
      setSeverity("warning");
      setOpen(true);
      window.location.href = "/account/login";
      return;
    }

    const isProductInWishlist = wishlist.some(
      (item) => item.productId === productId,
    );
    console.log("isProductInWishlist", isProductInWishlist);
    const shopURL = window.location.host;
    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", productId);
    formDataToSend.append("customerId", customerId);

    try {
      if (isProductInWishlist) {
        const response = await fetch(
          `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=${RemoveOne}&productId=${productId}`,
          {
            method: "POST",
            body: formDataToSend,
          },
        );
        const result = await response.json();
        console.log("🚀 ~ ProductCardWishlistButton ~ result:", result);
        if (result) {
          setMessage("Product successfully Deleted from wishlist");
          setSeverity("success");
          setOpen(true);
        }
        setWishlist((prev) =>
          prev.filter((item) => item.productId !== productId),
        );
      } else {
        // Add product to wishlist
        const response = await fetch("/apps/wishlist/api/savewishlist", {
          method: "POST",
          body: formDataToSend,
        });
        const result = await response.json();
        if (result) {
          if (result) {
            setMessage("Product successfully added to wishlist");
            setSeverity("success");
            setOpen(true);
          }
        }

        setWishlist((prev) => [
          ...prev,
          { productId, productName, productUrl },
        ]);
      }
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {createPortal(
        <NotificationAlert
          open={open}
          handleClose={handleClose}
          severity={severity}
          message={message}
        />,
        document.querySelector("body"),
      )}

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
                backgroundColor: "white",
                height: "39px",
                width: "40px",
                borderRadius: "50%",
                display: "inlineBlock",
              }}
            >
              {product && (
                <IconButton
                  sx={{
                    fontSize: "20px",
                  }}
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
              )}
            </div>,
            productCardNode,
          );
        })}

      {/* For Home Page */}
      {window.ShopifyAnalytics.meta.page.pageType === "home" &&
        productCardNodes.map((productCardNode, index) => {
          let productGid = "";
          console.log(
            "🚀 ~ ProductCardWishlistButton ~ productGid:",
            productGid,
          );
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
          // console.log(
          //   "🚀 ~ ProductCardWishlistButton ~ isProductInWishlist:",
          //   isProductInWishlist,
          // );

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

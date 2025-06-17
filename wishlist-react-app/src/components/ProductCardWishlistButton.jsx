// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import IconButton from "@mui/material/IconButton";
// import Favorite from "@mui/icons-material/Favorite";
// import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
// import { getCustomerid } from "../lib/lib";
// import { useWishlist } from "./WishlistContext";
// import toast from "react-hot-toast";

// const ProductCardWishlistButton = () => {
//   const [wishlist, setWishlist] = useState([]);
//   const [productCardNodes, setProductCardNodes] = useState([]);
//   const [productLinkNodes, setProductLinkNodes] = useState([]);
//   const [isloading, setLoading] = useState(false);
//   console.log("isloading:", isloading);
//   const customerId = getCustomerid();
//   const productLinkNodeSelector =
//     ".card-wrapper .card > .card__content .card__information .card__heading a";
//   const productCardWrapperSelector = ".grid__item .card-wrapper";
//   const { setWishlistCount } = useWishlist();
//   setWishlistCount(wishlist.length);

//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await fetch(
//           `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
//         );
//         const result = await response.json();
//         if (result) {
//           setWishlist(result.wishlistdata);
//           setLoading(true);
//         }
//       } catch (error) {
//         setLoading(false);
//       }
//     };

//     fetchWishlist();
//   }, []);

//   useEffect(() => {
//     const productCardNodesArray = document.querySelectorAll(
//       productCardWrapperSelector,
//     );
//     const productLinkElements = document.querySelectorAll(
//       productLinkNodeSelector,
//     );
//     setProductCardNodes(Array.from(productCardNodesArray));
//     setProductLinkNodes(Array.from(productLinkElements));
//   }, []);

//   const handleWishlistToggle = async (
//     productId,
//     productName,
//     productUrl,
//     RemoveOne = "RemoveOne",
//   ) => {
//     if (!customerId) {
//       toast.error("Please login to use the wishlist");
//       window.location.href = "/account/login";
//       return;
//     }
//     const isProductInWishlist = wishlist.some(
//       (item) => item.productId === productId,
//     );
//     const shopURL = window.location.host;
//     const formDataToSend = new FormData();
//     formDataToSend.append("shopURL", shopURL);
//     formDataToSend.append("productId", productId);
//     formDataToSend.append("customerId", customerId);

//     try {
//       if (isProductInWishlist) {
//         const response = await fetch(
//           `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=${RemoveOne}&productId=${productId}`,
//           {
//             method: "POST",
//             body: formDataToSend,
//           },
//         );
//         const result = await response.json();
//         if (result) {
//           toast.success("Product successfully Removed from wishlist");
//         }
//         setWishlist((prev) =>
//           prev.filter((item) => item.productId !== productId),
//         );
//       } else {
//         // Add product to wishlist
//         const response = await fetch("/apps/wishlist/api/savewishlist", {
//           method: "POST",
//           body: formDataToSend,
//         });
//         const result = await response.json();
//         if (result) {
//           if (result) {
//             toast.success("Product successfully added to wishlist");
//           }
//         }
//         setWishlist((prev) => [
//           ...prev,
//           { productId, productName, productUrl },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error updating wishlist", error);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };
//   return (
//     <>
//       {/* Only render if ShopifyAnalytics and meta exist */}
//       {window.ShopifyAnalytics?.meta?.products?.length &&
//         productCardNodes?.length &&
//         productCardNodes.map((productCardNode, index) => {
//           const product = window.ShopifyAnalytics?.meta?.products[index];
//           if (!product) return null;
//           const productId = product.gid;
//           const productUrl = productLinkNodes[index]?.href;
//           const isProductInWishlist = wishlist.some(
//             (item) => item.productId === productId,
//           );

//           return createPortal(
//             <div
//               key={productId}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 zIndex: 10,
//                 backgroundColor: "white",
//                 height: "39px",
//                 width: "40px",
//                 borderRadius: "50%",
//                 display: "inlineBlock",
//                 opacity: isloading ? 1 : 0.5,
//                 pointerEvents: isloading ? "auto" : "none",
//               }}
//             >
//               <IconButton
//                 sx={{
//                   fontSize: "20px",
//                 }}
//                 disabled={!isloading}
//                 onClick={() =>
//                   handleWishlistToggle(productId, product?.name, productUrl)
//                 }
//                 style={{ color: isProductInWishlist ? "red" : "grey" }}
//                 aria-label={
//                   isProductInWishlist
//                     ? "Remove from Wishlist"
//                     : "Add to Wishlist"
//                 }
//               >
//                 {isProductInWishlist ? (
//                   <Favorite sx={{ fontSize: "x-large" }} />
//                 ) : (
//                   <FavoriteBorder sx={{ fontSize: "x-large" }} />
//                 )}
//               </IconButton>
//             </div>,
//             productCardNode,
//           );
//         })}

//       {/* For Home Page */}
//       {window.ShopifyAnalytics?.meta?.page?.pageType === "home" &&
//         productCardNodes.map((productCardNode, index) => {
//           let productGid = "";

//           const idSplitArray =
//             productLinkNodes[index].parentElement.id.split("-");
//           const id = idSplitArray[idSplitArray.length - 1];
//           if (id) productGid = "gid://shopify/Product/" + id;
//           else {
//             return null;
//           }

//           const productUrl = productLinkNodes[index].href;
//           const selectedVariantId = "";
//           const isProductInWishlist = wishlist.some(
//             (item) => item.productId === productGid,
//           );

//           return createPortal(
//             <div
//               key={productGid}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 zIndex: 10,
//                 backgroundColor: "white",
//                 height: "39px",
//                 width: "40px",
//                 borderRadius: "50%",
//                 opacity: isloading ? 1 : 0.5,
//                 pointerEvents: isloading ? "auto" : "none",
//                 display: "inlineBlock",
//               }}
//             >
//               <IconButton
//                 disabled={!isloading}
//                 sx={{ fontSize: "20px" }}
//                 onClick={() => handleWishlistToggle(productGid, productUrl)}
//                 style={{ color: isProductInWishlist ? "red" : "grey" }}
//                 aria-label={
//                   isProductInWishlist
//                     ? "Remove from Wishlist"
//                     : "Add to Wishlist"
//                 }
//               >
//                 {isProductInWishlist ? (
//                   <Favorite sx={{ fontSize: "x-large" }} />
//                 ) : (
//                   <FavoriteBorder sx={{ fontSize: "x-large" }} />
//                 )}
//               </IconButton>
//             </div>,
//             productCardNode,
//           );
//         })}
//     </>
//   );
// };

// export default ProductCardWishlistButton;

//========================Ai updated code=============
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { getCustomerid } from "../lib/lib";
import { useWishlist } from "./WishlistContext";
import toast from "react-hot-toast";

const ProductCardWishlistButton = () => {
  const [productCardNodes, setProductCardNodes] = useState([]);
  const [productLinkNodes, setProductLinkNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const customerId = getCustomerid();
  const {
    wishlistItems,
    updateWishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  } = useWishlist();

  useEffect(() => {
    let mounted = true;
    let lastFetchTime = 0;
    const FETCH_THROTTLE = 1000; // Prevent multiple fetches within 1 second

    const fetchWishlist = async (force = false) => {
      if (!customerId) return;

      const now = Date.now();
      if (!force && now - lastFetchTime < FETCH_THROTTLE) return;
      lastFetchTime = now;

      try {
        if (mounted) setLoading(true);
        const response = await fetch(
          `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const result = await response.json();
        if (mounted && result?.wishlistdata) {
          const formattedItems = result.wishlistdata.map((item) => ({
            productId: item.productId,
            timestamp: item.timestamp,
          }));
          updateWishlist(formattedItems);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchWishlist(true);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchWishlist();
      }
    };

    // Handle URL changes
    const handleUrlChange = () => {
      fetchWishlist();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handleUrlChange);

    // Cleanup
    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [customerId, updateWishlist]);

  // Update DOM nodes
  useEffect(() => {
    const productCardWrapperSelector = ".grid__item .card-wrapper";
    const productLinkNodeSelector =
      ".card-wrapper .card > .card__content .card__information .card__heading a";

    const productCardNodesArray = document.querySelectorAll(
      productCardWrapperSelector,
    );
    const productLinkElements = document.querySelectorAll(
      productLinkNodeSelector,
    );

    setProductCardNodes(Array.from(productCardNodesArray));
    setProductLinkNodes(Array.from(productLinkElements));
  }, []);

  const handleWishlistToggle = async (productId, productName, productUrl) => {
    if (!customerId) {
      toast.error("Please login to use the wishlist");
      const shopDomain = window.location.hostname;
      window.location.href = `/account/login?return_to=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (!productId) {
      console.error("Invalid product ID");
      return;
    }

    const shopURL = window.location.host;
    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", productId);
    formDataToSend.append("customerId", customerId);

    const isInWishlist = isProductInWishlist(productId);
    let success = false;

    try {
      if (isInWishlist) {
        // Optimistically remove from state
        removeFromWishlist(productId);

        const response = await fetch(
          `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=RemoveOne&productId=${productId}`,
          { method: "DELETE" },
        );

        if (!response.ok) throw new Error("Failed to remove from wishlist");

        const result = await response.json();
        success = result?.success;

        if (success) {
          toast.success("Product removed from wishlist");
        } else {
          throw new Error("Failed to remove from wishlist");
        }
      } else {
        // Optimistically add to state
        const wishlistItem = {
          productId,
          productName,
          productUrl,
          timestamp: new Date().toISOString(),
        };
        addToWishlist(wishlistItem);

        const response = await fetch("/apps/wishlist/api/savewishlist", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");

        const result = await response.json();
        success = result?.success;

        if (success) {
          toast.success("Product added to wishlist");
        } else {
          throw new Error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // Revert optimistic update on failure
      if (isInWishlist) {
        addToWishlist({ productId, productName, productUrl });
      } else {
        removeFromWishlist(productId);
      }
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <>
      {/* Only render if ShopifyAnalytics and meta exist */}
      {window.ShopifyAnalytics?.meta?.products?.length &&
        productCardNodes?.length &&
        productCardNodes.map((productCardNode, index) => {
          const product = window.ShopifyAnalytics?.meta?.products[index];
          if (!product) return null;

          const productId = product.gid;
          const productUrl = productLinkNodes[index]?.href;
          const inWishlist = isProductInWishlist(productId);

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
                opacity: loading ? 0.7 : 1,
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              <IconButton
                sx={{ fontSize: "20px" }}
                     disabled={loading}
                onClick={() =>
                  handleWishlistToggle(productId, product?.name, productUrl)
                }
                style={{ color: inWishlist ? "red" : "grey" }}
                aria-label={
                  inWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {inWishlist ? (
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
      {window.ShopifyAnalytics?.meta?.page?.pageType === "home" &&
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
          const inWishlist = isProductInWishlist(productGid);

          return createPortal(
            <div
              key={productGid}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
                backgroundColor: "white",
                height: "39px",
                width: "40px",
                display: "inlineBlock",
                borderRadius: "50%",
                opacity: loading ? 0.5 : 1,
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              <IconButton
                disabled={loading}
                sx={{ fontSize: "20px" }}
                onClick={() => handleWishlistToggle(productGid, productUrl)}
                style={{ color: inWishlist ? "red" : "grey" }}
                aria-label={
                  inWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                }
              >
                {inWishlist ? (
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

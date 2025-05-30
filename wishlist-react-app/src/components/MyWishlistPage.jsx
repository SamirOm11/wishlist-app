import React, { useState, useEffect } from "react";
import "./mywishlistpage.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { createPortal } from "react-dom";
import Button from "@mui/material/Button";
import { getCustomerid } from "../lib/lib";
import { addAlltoCart, addtoCart } from "../utils/utils";
import SimpleBackdrop from "./Fullscreenloader";
import toast from "react-hot-toast";
import { WishlistModal } from "./Modal/Model";
import WishlistLauncher from "./WishlistLauncher";
import { useWishlist } from "./WishlistContext";

const MyWishlistPage = () => {
  const [wishlistProDuct, setWishlistProduct] = useState("");
  const [isWishlistEmpty, setIsWishlistEmpty] = useState(false);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const shopURL = window.location.host;
  const customeId = getCustomerid();
  const [openModalProductId, setOpenModalProductId] = useState(null);
  const wishlistProductCount = wishlistProDuct?.length || 0;
  const wishlistUrl = window.location.href;
  const { setWishlistCount } = useWishlist();
  setWishlistCount(wishlistProductCount);

  const fetchWishlistProductData = async () => {
    setLoaderOpen(true);
    try {
      const response = await fetch(
        `/apps/wishlist/api/displayproductwishlist?shopURL=${shopURL}&customeId=${customeId}`,
      );
      const result = await response.json();
      if (result) {
        setLoaderOpen(false);
        setWishlistProduct(result?.wishlistData || []);
      }
    } catch (error) {
      console.log("fetchWishlistProductData ~ error:", error);
    } finally {
      setLoaderOpen(false);
    }
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Wishlist",
          text: "Check out my wishlist!",
          url: wishlistUrl,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      setShowPopup(true);
    }
  };

  //===============================OR===============================
  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(wishlistUrl);
  //   alert("Wishlist link copied!");
  // };

  const handleDeleteWishlist = async (RemoveOne, item) => {
    setLoaderOpen(true);

    try {
      const response = await fetch(
        `/apps/wishlist/api/deleteAllWishProduct?customeId=${customeId}&type=${RemoveOne}&productId=${item.id}`,
        {
          method: "DELETE",
        },
      );
      const result = await response.json();
      if (result) {
        if (RemoveOne === "RemoveOne") {
          // Remove product from wishlist in state after successful deletion
          setWishlistProduct((prevWishlist) => {
            return prevWishlist.filter(
              (wishlistItem) => wishlistItem.id !== item.id,
            );
          });
        } else {
          setWishlistProduct([]);
        }
        toast.success("Product successfully deleted");
      }
    } catch (error) {
    } finally {
      setLoaderOpen(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!item) {
      return;
    }
    setLoaderOpen(true);

    const { error } = await addtoCart({
      wishlistProDucts: [item],
    });

    if (error) {
      toast.error("Unable to add item to cart. Please try again.");
      setLoaderOpen(false);
    } else {
      toast.success("Product successfully added to cart!");
      setLoaderOpen(false);
    }
  };

  const handleAddAlltoCart = async (item) => {
    if (!item) {
      return;
    }

    const { error } = await addAlltoCart({
      wishlistProDucts: item,
    });

    if (error) {
      toast.error("Unable to add item to cart. Please try again.");
      setLoaderOpen(false);
    } else {
      toast.success("Product's successfully added to cart!");
    }
  };

  const openModal = (productId) => setOpenModalProductId(productId);
  const closeModal = () => setOpenModalProductId(null);

  useEffect(() => {
    fetchWishlistProductData();
  }, []);

  useEffect(() => {
    if (wishlistProDuct?.length) setIsWishlistEmpty(false);
    else setIsWishlistEmpty(true);
  }, [wishlistProDuct]);

  return (
    <>
      {!customeId && (
        <div style={{ width: "100%", backgroundColor: "black" }}>
          <h1 className="wishlist-login-message">
            Please login to save this Wishlist to your Account. (This is
            optional)
          </h1>
        </div>
      )}
      <div className="wishlist-actions-bar">
        <Button
          sx={{
            fontSize: "12px",
            backgroundColor: "black",
            color: "white",
          }}
          onClick={() => handleDeleteWishlist("clearAll", 0)}
        >
          Clear All
        </Button>
        <Button
          sx={{
            fontSize: "12px",
            backgroundColor: "black",
            color: "white",
          }}
          onClick={() => handleAddAlltoCart(wishlistProDuct)}
        >
          Add All
        </Button>
        <button
          onClick={() => handleShareWishlist()}
          className="share-button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: "8px",
          }}
          aria-label="Share Wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {loaderOpen
        ? createPortal(
            <SimpleBackdrop open={loaderOpen} setOpen={setLoaderOpen} />,
            document.querySelector("body"),
          )
        : isWishlistEmpty && (
            <h2 style={{ paddingTop: "120px" }} className="Empty-Wishlist-Text">
              Wishlist is Empty!
            </h2>
          )}

      {wishlistProDuct.length ? (
        <div className="wishlist-container">
          {wishlistProDuct?.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <div className="wishlist-image-container">
                <img
                  className="wishlist-product-image"
                  src={item?.media?.edges[0]?.node?.preview?.image?.url}
                  alt={item.title}
                />
              </div>
              <div className="wishlist-info">
                <p className="wishlist-product-title">{item.title}</p>
                <p className="wishlist-product-price">
                  ₹{item.priceRangeV2?.minVariantPrice?.amount}
                </p>
                <div className="wishlist-actions">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="add-to-cart-button"
                  >
                    <ShoppingCartIcon />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => openModal(item.id)}
                    className="remove-button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    aria-label="Remove"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
              {openModalProductId === item.id &&
                createPortal(
                  <WishlistModal
                    closeModal={closeModal}
                    handleDeleteWishlist={() =>
                      handleDeleteWishlist("RemoveOne", item)
                    }
                  />,
                  document.querySelector("body"),
                )}
            </div>
          ))}
        </div>
      ) : (
        " "
      )}
    </>
  );
};

export default MyWishlistPage;

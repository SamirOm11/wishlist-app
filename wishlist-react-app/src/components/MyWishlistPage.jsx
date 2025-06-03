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
import { title } from "process";

const MyWishlistPage = () => {
  const [wishlistProDuct, setWishlistProduct] = useState([]);
  const [isWishlistEmpty, setIsWishlistEmpty] = useState(false);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const shopURL = window.location.host;
  const customeId = getCustomerid();
  const [modalState, setModalState] = useState({
    open: false,
    type: null,
    productId: null,
  });

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
      toast.error("Failed to fetch wishlist data.");
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
      toast.error("Failed to delete wishlist item(s).");
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

  // Modal openers
  const openRemoveOneModal = (productId) =>
    setModalState({ open: true, type: "removeOne", productId });
  const openAddAllModal = () =>
    setModalState({ open: true, type: "addAll", productId: null });
  const openClearAllModal = () =>
    setModalState({ open: true, type: "clearAll", productId: null });
  const closeModal = () =>
    setModalState({ open: false, type: null, productId: null });

  // Modal props based on action

  const getModalProps = () => {
    switch (modalState.type) {
      case "removeOne":
        return {
          message:
            "Are you sure you want to remove this item from your wishlist?",
          confirmLabel: "Remove",
          title: "Remove From Wishlist",
          onConfirm: () =>
            handleDeleteWishlist(
              "RemoveOne",
              wishlistProDuct.find((item) => item.id === modalState.productId),
            ),
        };
      case "addAll":
        return {
          message: "Add all wishlist items to cart?",
          confirmLabel: "Add All",
          title: "Add All to Cart",
          onConfirm: () => handleAddAlltoCart(wishlistProDuct),
        };
      case "clearAll":
        return {
          message: "Clear all items from wishlist?",
          confirmLabel: "Clear All",
          title: "Clear Wishlist",
          onConfirm: () => handleDeleteWishlist("clearAll", {}),
        };
      default:
        return {};
    }
  };

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
          onClick={openClearAllModal}
        >
          Clear All
        </Button>
        <Button
          sx={{
            fontSize: "12px",
            backgroundColor: "black",
            color: "white",
          }}
          onClick={openAddAllModal}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // paddingTop: "100px",
                minHeight: "40vh",
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                // style={{ marginBottom: "24px" }}
              >
                <circle cx="60" cy="60" r="56" fill="#F5F6FA" />
                <path
                  d="M60 88s-28-18.7-28-36.2C32 39.5 43.2 32 54.2 37.7c2.3 1.2 4.2 3.3 5.8 5.3 1.6-2 3.5-4.1 5.8-5.3C76.8 32 88 39.5 88 51.8 88 69.3 60 88 60 88z"
                  stroke="#A5B4FC"
                  strokeWidth="3"
                  fill="none"
                />
                <g>
                  <circle
                    cx="60"
                    cy="60"
                    r="18"
                    fill="#fff"
                    stroke="#A5B4FC"
                    strokeWidth="2"
                  />
                  <path
                    d="M68 52L52 68M52 52l16 16"
                    stroke="#F87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>
              </svg>

              <h2
                className="Empty-Wishlist-Text"
                style={{
                  fontWeight: 600,
                  fontSize: "3rem",
                  color: "#22223B",
                  marginBottom: "8px",
                  textAlign: "center",
                }}
              >
                Your Wishlist is Empty
              </h2>
            </div>
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
                    onClick={() => openRemoveOneModal(item.id)}
                    className="remove-button"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: "black",
                    }}
                    aria-label="Remove"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 105.7 122.88"
                      aria-hidden="true"
                    >
                      <title>trash-bin</title>
                      <path
                        fill="currentColor"
                        d="M30.46,14.57V5.22A5.18,5.18,0,0,1,32,1.55v0A5.19,5.19,0,0,1,35.68,0H70a5.22,5.22,0,0,1,3.67,1.53l0,0a5.22,5.22,0,0,1,1.53,3.67v9.35h27.08a3.36,3.36,0,0,1,3.38,3.37V29.58A3.38,3.38,0,0,1,102.32,33H98.51l-8.3,87.22a3,3,0,0,1-2.95,2.69H18.43a3,3,0,0,1-3-2.95L7.19,33H3.37A3.38,3.38,0,0,1,0,29.58V17.94a3.36,3.36,0,0,1,3.37-3.37Zm36.27,0V8.51H39v6.06ZM49.48,49.25a3.4,3.4,0,0,1,6.8,0v51.81a3.4,3.4,0,1,1-6.8,0V49.25ZM69.59,49a3.4,3.4,0,1,1,6.78.42L73,101.27a3.4,3.4,0,0,1-6.78-.43L69.59,49Zm-40.26.42A3.39,3.39,0,1,1,36.1,49l3.41,51.8a3.39,3.39,0,1,1-6.77.43L29.33,49.46ZM92.51,33.38H13.19l7.94,83.55H84.56l8-83.55Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {modalState.open &&
                createPortal(
                  <WishlistModal
                    closeModal={closeModal}
                    handleConfirm={() => {
                      getModalProps().onConfirm();
                      closeModal();
                    }}
                    message={getModalProps().message}
                    title={getModalProps().title}
                    confirmLabel={getModalProps().confirmLabel}
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

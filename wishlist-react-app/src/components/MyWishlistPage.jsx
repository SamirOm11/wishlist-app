import React, { useState, useEffect } from "react";
import "./mywishlistpage.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { createPortal } from "react-dom";
import Button from "@mui/material/Button";
import { getCustomerid } from "../lib/lib";
import { addAlltoCart, addtoCart } from "../utils/utils";
import SimpleBackdrop from "./Fullscreenloader";
import { NotificationAlert } from "./NotificationAlert";
import { WishlistModal } from "./Modal/Model";

const MyWishlistPage = () => {
  const [wishlistProDuct, setWishlistProduct] = useState("");
  const [isWishlistEmpty, setIsWishlistEmpty] = useState(false);
  const [loaderOpen, setLoaderOpen] = React.useState(false);
  const shopURL = window.location.host;
  const customeId = getCustomerid();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const wishlistUrl = window.location.href;

  const fetchWishlistProductData = async () => {
    setLoaderOpen(true);
    try {
      const response = await fetch(
        `/apps/wishlist/api/displayproductwishlist?shopURL=${shopURL}&customeId=${customeId}`,
      );
      const result = await response.json();
      console.log('result: ', result);
      if (result) {
        setLoaderOpen(false);
        setWishlistProduct(result?.wishlistData || []);
      }
    } catch (error) {
      console.log("🚀 ~ fetchWishlistProductData ~ error:", error);
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
  const copyToClipboard = () => {
    navigator.clipboard.writeText(wishlistUrl);
    alert("Wishlist link copied!");
  };

  const handleDeleteWishlist = async (RemoveOne, item) => {
    console.log("🚀 ~ handleDeleteWishlist ~ item:", item);
    setLoaderOpen(true);

    try {
      const response = await fetch(
        `/apps/wishlist/api/deleteAllWishProduct?customeId=${customeId}&type=${RemoveOne}&productId=${item.id}`,
        {
          method: "DELETE",
        },
      );
      const result = await response.json();
      console.log("🚀 ~ handleDeleteWishlist ~ result:", result);
      if (result) {
        console.log("INSIDE");
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

        setMessage("Product successfully deleted");
        setSeverity("success");
        setOpen(true);
      }
    } catch (error) {
      console.log("🚀 ~ handleDeleteWishlist ~ error:", error);
    } finally {
      setLoaderOpen(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!item) {
      console.log("No wishlist data available");
      return;
    }

    const { error } = await addtoCart({
      wishlistProDucts: [item],
    });

    if (error) {
      console.log("Error during Add to Cart:", error);
      setMessage("Error during Add to Cart:");
      setSeverity("error");
      setOpen(true);
    } else {
      setMessage("Product successfully added to cart!");
      setSeverity("success");
      setOpen(true);
      console.log("Successfully added to cart");
    }
  };

  const handleAddAlltoCart = async (item) => {
    if (!item) {
      console.log("No wishlist data available");
      return;
    }

    const { error } = await addAlltoCart({
      wishlistProDucts: item,
    });

    if (error) {
      console.log("Error during Add to Cart:", error);
      setMessage("Error during Add to Cart:");
      setSeverity("error");
      setOpen(true);
    } else {
      setMessage("Product successfully added to cart!");
      setSeverity("success");
      setOpen(true);
      console.log("Successfully added to cart");
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    fetchWishlistProductData();
  }, []);

  useEffect(() => {
    if (wishlistProDuct?.length) setIsWishlistEmpty(false);
    else setIsWishlistEmpty(true);
  }, [wishlistProDuct]);

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

      {createPortal(
        <div>
          {!customeId ? (
            <div style={{ width: "500px", backgroundColor: "black" }}>
              <h1 className="wishlist-login-message">
                Please login to save this Wishlist to your Account. (This is
                optional)
              </h1>
            </div>
          ) : (
            ""
          )}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: "150px",
              right: "110px",
              gap: "10px",
              zIndex: "99",
            }}
          >
            <Button
              sx={{
                fontSize: "12px",
                backgroundColor: "black",
                color: "white",
              }}
              onClick={() => handleShareWishlist()}
            >
              Share Wishlist
            </Button>
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
          </div>
        </div>,

        document.querySelector("body"),
      )}

      {loaderOpen
        ? createPortal(
            <SimpleBackdrop open={loaderOpen} setOpen={setLoaderOpen} />,
            document.querySelector("body"),
          )
        : isWishlistEmpty && (
            <h2 className="Empty-Wishlist-Text">Wishlist is Empty!</h2>
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
                <p className="wishlist-product-price">
                  ₹{item.priceRangeV2?.minVariantPrice?.amount}
                </p>
                <p className="wishlist-product-title">{item.title}</p>
                <div className="wishlist-actions">
                  <button
                    onClick={() => {
                      openModal();
                    }}
                    className="remove-button"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="add-to-cart-button"
                  >
                    <ShoppingCartIcon />
                    Add to Cart
                  </button>
                </div>
              </div>
              {isOpen &&
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

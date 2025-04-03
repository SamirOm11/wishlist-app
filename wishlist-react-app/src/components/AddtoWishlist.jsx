import React from "react";
import Button from "@mui/material/Button";
import { getProductid } from "../utils/lib";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NotificationAlert } from "./NotificationAlert";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { getCustomerid } from "../utils/lib";

const AddtoWishlist = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [wishlist, setWishlist] = useState("");
  const [isAdded, setIsAdded] = useState();
  console.log("🚀 ~ AddtoWishlist ~ isAdded:", isAdded);
  const dynamicProdutId = getProductid();
  console.log("🚀 ~ AddtoWishlist ~ dynamicProdutId:", dynamicProdutId);
  const customerId = getCustomerid();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(
          `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
        );
        const result = await response.json();
        console.log("🚀 ~ fetchWishlist ~ result:", result);

        if (result.success) {
          console.log("Inside The result.success");
          console.log("result.wishlistdata", result.wishlistdata);
          if (Array.isArray(result.wishlistdata)) {
            const isProductInWishlist = result.wishlistdata.some(
              (product) => product.productId === dynamicProdutId,
            );
            console.log(
              "🚀 ~ fetchWishlist ~ isProductInWishlist:",
              isProductInWishlist,
            );
            setIsAdded(isProductInWishlist);
          } else {
            console.warn("wishlistData is not an array:", result.wishlistdata);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [customerId, dynamicProdutId]);

  const handleclick = async (RemoveOne) => {
    RemoveOne = "RemoveOne";
    console.log("🚀 ~ handleclick ~ RemoveOne:", RemoveOne)
    const shopURL = window.location.host;
    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", dynamicProdutId);
    formDataToSend.append("customerId", customerId);
    if (isAdded) {
      console.log("Inside the remove wishlist api function");
      try {
        const response = await fetch(
          `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=${RemoveOne}&productId=${dynamicProdutId}`,
          {
            method: "DELETE",
          },
        );
        console.log("🚀 ~ handleclick ~ response:", response);
        const result = await response.json();
        if (result.success) {
          setIsAdded(false);
          setMessage("Product removed from wishlist!");
          setSeverity("success");
          setOpen(true);
        } else {
          setMessage("Error removing product from wishlist!");
          setSeverity("error");
          setOpen(true);
        }
      } catch (error) {
        setMessage("Error removing product from wishlist!");
        setSeverity("error");
        setOpen(true);
      }
    } else {
      console.log("Inside the Save wishlist api function");
      try {
        const response = await fetch("/apps/wishlist/api/savewishlist", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          console.error("Error response:", response);
          setMessage("Error adding product to wishlist!");
          setSeverity("error");
          setOpen(true);
          return;
        }

        const result = await response.json();
        setWishlist(result?.wishlistData);
        console.log("Result: ", result);

        if (result.success) {
          setMessage("Product added to wishlist!");
          setSeverity("success");
          setIsAdded(true);
          setOpen(true);
        } else {
          setMessage("Something went wrong, please try again.");
          setSeverity("error");
          setOpen(true);
        }
      } catch (error) {
        console.error("Error from AddToWishlist:", error);
        setMessage("An error occurred. Please try again.");
        setSeverity("error");
        setOpen(true);
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {createPortal(
        <NotificationAlert
          open={open}
          handleClose={handleClose}
          severity={severity}
          message={message}
        />,
        document.querySelector("body"),
      )}

      <Button
        sx={{
          fontSize: "small",
          width: "345px",
          height: "45px",
          color: "white",
          backgroundColor: "rgb(255 87 117)",
        }}
        variant="outlined"
        onClick={handleclick}
      >
        {isAdded ? (
          <div style={{ paddingRight: "10px", paddingTop: "inherit" }}>
            <FavoriteIcon style={{ fontSize: "large" }} />
          </div>
        ) : (
          <div style={{ paddingRight: "10px", paddingTop: "inherit" }}>
            <FavoriteBorderIcon style={{ fontSize: "large" }} />
          </div>
        )}

        {isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>
    </div>
  );
};

export default AddtoWishlist;

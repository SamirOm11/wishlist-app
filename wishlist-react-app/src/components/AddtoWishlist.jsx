import React from "react";
import Button from "@mui/material/Button";
import { getProductid } from "../utils/lib";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { NotificationAlert } from "./NotificationAlert";
import { createPortal } from "react-dom";
import { useState } from "react";
import { getCustomerid } from "../utils/lib";

const AddtoWishlist = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleclick = async () => {
    const dynamicProdutId = getProductid();
    const customerId = getCustomerid();
    console.log("🚀 ~ handleclick ~ customerId:", customerId)
    const shopURL = window.location.host;

    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", dynamicProdutId);
    formDataToSend.append("customerId",customerId)

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
      console.log("Result: ", result);
      if (result.success) {
        setMessage("Product added to wishlist!");
        setSeverity("success");
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
          backgroundColor: "#ff3333",
        }}
        variant="outlined"
        onClick={handleclick}
      >
        <div style={{ paddingRight: "10px", paddingTop: "inherit" }}>
          <FavoriteBorderIcon style={{ fontSize: "large" }} />
        </div>
        Add to Wishlist
      </Button>
    </div>
  );
};

export default AddtoWishlist;

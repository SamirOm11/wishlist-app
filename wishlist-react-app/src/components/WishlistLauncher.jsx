import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Button from "@mui/material/Button";
import { useWishlist } from "./WishlistContext";

const WishlistLauncher = () => {
  const { wishlistCount } = useWishlist();
  console.log("wishlistCount==:", wishlistCount);

  return (
    <div className="wishlist-launcher">
      <div style={{width:"38px", paddingTop: "7px", display: "flex", alignItems: "center" }}>
        <a
          href="/apps/wishlist/wishlistpageredirect"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: "28px" }} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: "absolute",
                // top: "-4px",
                bottom: "0px",
                right: "-8px",
                backgroundColor: "#e60023",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 2px",
                fontSize: "12px",
                fontWeight: "bold",
                lineHeight: 1,
                minWidth: "18px",
                textAlign: "center",
              }}
            >
              {wishlistCount}
            </span>
          )}
        </a>
      </div>
    </div>
  );
};

export default WishlistLauncher;

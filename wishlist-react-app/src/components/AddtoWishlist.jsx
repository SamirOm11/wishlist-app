import React from "react";
import Button from "@mui/material/Button";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getProductid } from "../lib/lib";
import { getCustomerid } from "../lib/lib";
import CircularProgress from "@mui/material/CircularProgress";
import { useWishlist } from "./WishlistContext";
import { getLocalWishlistState, setLocalWishlistState } from "../utils/wishlistlocalstorage";

const AddtoWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const dynamicProdutId = getProductid();
  const customerId = getCustomerid();
  const { setWishlistCount } = useWishlist();

  // Initialize wishlist state from local storage
  useEffect(() => {
    const localWishlistState = getLocalWishlistState(dynamicProdutId);
    console.log('localWishlistState: ', localWishlistState);
    
    if (localWishlistState) {
      setIsAdded(localWishlistState);
    }
  }, [dynamicProdutId]);




  const fetchWishlist = async () => {
    try {
      const response = await fetch(
        `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
        { cache: "force-cache" },
      );
      const result = await response.json();
      if (result.success) {
        if (Array.isArray(result.wishlistdata)) {
          const isProductInWishlist = result.wishlistdata.some(
            (product) => product.productId === dynamicProdutId,
          );
          setWishlist(result.wishlistdata);
          setIsAdded(isProductInWishlist);
           setLocalWishlistState(isProductInWishlist);
        } else {
          console.warn("wishlistData is not an array:", result.wishlistdata);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWishlist();
  }, [customerId, dynamicProdutId]);

  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  const handleclick = async (RemoveOne) => {
    if (!customerId) {
      toast.error("Please login to use the wishlist");
      const shopDomain = window.location.hostname;
      window.location.href = `https://${shopDomain}/account/login`;
      return;
    }

    RemoveOne = "RemoveOne";
    const shopURL = window.location.host;
    const formDataToSend = new FormData();
    formDataToSend.append("shopURL", shopURL);
    formDataToSend.append("productId", dynamicProdutId);
    formDataToSend.append("customerId", customerId);
    if (isAdded) {
      try {
        const response = await fetch(
          `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=${RemoveOne}&productId=${dynamicProdutId}`,
          {
            method: "DELETE",
          },
        );
        const result = await response.json();
        if (result.success) {
          setWishlist((prev) => {
            // dynamicProdutId isse match hone wale product ko chodkar kar saare product dega
            const newWishlist = prev.filter(
              (item) => item.productId !== dynamicProdutId,
            );
            setWishlistCount(newWishlist.length);
            return newWishlist;
          });
          setIsAdded(false);
          setLocalWishlistState(false);
          toast.success("Product removed from wishlist!");
        } else {
          toast.error("Error removing product from wishlist!");
        }
      } catch  {
        toast.error("Error removing product from wishlist!");
      }
    } else {
      try {
        const response = await fetch("/apps/wishlist/api/savewishlist", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          toast.error("Error adding product to wishlist!");
          return;
        }

        const result = await response.json();
        // setWishlist(result?.wishlistData);
        if (result.success) {
          if (Array.isArray(result.wishlistData)) {
            setWishlist(result.wishlistData);
            setWishlistCount(result.wishlistData.length);
          } else {
            // Single item case - add to existing wishlist
            setWishlist((prev) => {
              const newWishlist = [
                ...(Array.isArray(prev) ? prev : []),
                result.wishlistData,
              ];
              setWishlistCount(newWishlist.length);
              return newWishlist;
            });
          }
          toast.success("Product added to wishlist!");
          setIsAdded(true);
          setLocalWishlistState(true);
        } else {
          toast.error("Product added to wishlist!");
        }
      } catch  {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
  <div>
  <Button
    sx={{
      fontSize: "small",
      width: "345px",
      height: "45px",
      color: "white",
      backgroundColor: loading ? "rgba(255, 87, 117, 0.5)" : "rgb(255, 87, 117)",
      "&.Mui-disabled": {
        backgroundColor: "rgba(255, 87, 117, 0.5)", // This ensures the color stays when disabled
        color: "white" // Keep text color white when disabled
      }
    }}
    variant="contained"
    disabled={loading}
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

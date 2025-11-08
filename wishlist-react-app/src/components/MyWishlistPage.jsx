import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./mywishlistpage.css";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareIcon from "@mui/icons-material/Share";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { createPortal } from "react-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getCustomerid } from "../lib/lib";
import { addAlltoCart, addtoCart } from "../utils/utils";
import SimpleBackdrop from "./Fullscreenloader";
import toast from "react-hot-toast";
import { WishlistModal } from "./Modal/Model";
import { useWishlist } from "./WishlistContext";

const MyWishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("dateAdded"); // dateAdded, priceHighToLow, priceLowToHigh
  const [filterBy, setFilterBy] = useState("all"); // all, inStock, outOfStock
  const [modalState, setModalState] = useState({
    open: false,
    type: null,
    item: null,
  });

  const shopURL = window.location.host;
  const customerId = getCustomerid();
  const { wishlistCount, setWishlistCount } = useWishlist();
  setWishlistCount(wishlistProducts.length);

  // Memoize sorted and filtered products
  const displayedProducts = useMemo(() => {
    let filtered = [...wishlistProducts];
console.log('Initial wishlistProducts:', wishlistProducts);
    console.log('Initial filtered products:', filtered);
    // Apply filters
    if (filterBy === "inStock") {
      filtered = filtered.filter(
        (item) =>
          item.availableForSale !== false &&
          item.variants?.edges?.[0]?.node?.availableForSale !== false,
      );
    } else if (filterBy === "outOfStock") {
      console.log('Filtering out of stock items');
      filtered = filtered.filter(
        (item) =>
          item.availableForSale === false ||
          item.variants?.edges?.[0]?.node?.availableForSale === false,
      );
      console.log('Filtered out of stock items:', filtered);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceHighToLow":
          return (
            (b.priceRangeV2?.minVariantPrice?.amount || 0) -
            (a.priceRangeV2?.minVariantPrice?.amount || 0)
          );
        case "priceLowToHigh":
          return (
            (a.priceRangeV2?.minVariantPrice?.amount || 0) -
            (b.priceRangeV2?.minVariantPrice?.amount || 0)
          );
        case "nameAZ":
          return (a.title || "").localeCompare(b.title || "");
        case "nameZA":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0; // Keep original order for dateAdded
      }
    });
  }, [wishlistProducts, sortBy, filterBy]);

  const fetchWishlistProductData = useCallback(async () => {
    if (!customerId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/apps/wishlist/api/displayproductwishlist?shopURL=${shopURL}&customeId=${customerId}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (result?.wishlistData) {
        setWishlistProducts(result.wishlistData);
      }
    } catch (error) {
      console.error("fetchWishlistProductData error:", error);
      toast.error("Unable to fetch your wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [customerId, shopURL]);

  const handleShareWishlist = async () => {
    const wishlistUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Curated Wishlist",
          text: `Check out my wishlist on ${shopURL}!`,
          url: wishlistUrl,
        });
        toast.success("Wishlist shared successfully!");
      } else {
        await navigator.clipboard.writeText(wishlistUrl);
        toast.success("Wishlist link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to share wishlist. Please try again.");
    }
  };

  const handleDeleteWishlist = useCallback(
    async (actionType, itemToDelete) => {
      setIsLoading(true);
      try {
        if (actionType === "RemoveOne") {
          await fetch(
            `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=RemoveOne&productId=${itemToDelete.id}`,
            {
              method: "DELETE",
            },
          );
          setWishlistProducts((prev) =>
            prev.filter((item) => item.id !== itemToDelete.id),
          );
          toast.success("Item removed from wishlist");
        } else if (actionType === "clearAll") {
          const deletePromises = wishlistProducts.map((item) =>
            fetch(
              `/apps/wishlist/api/deleteAllWishProduct?customeId=${customerId}&type=RemoveOne&productId=${item.id}`,
              {
                method: "DELETE",
              },
            ),
          );
          await Promise.all(deletePromises);
          setWishlistProducts([]);
          toast.success("Wishlist cleared successfully");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to remove item(s). Please try again.");
      } finally {
        setIsLoading(false);
        closeModal();
      }
    },
    [customerId, wishlistProducts],
  );

  const handleAddToCart = useCallback(async (items, isMultiple = false) => {
    if (!items?.length) return;

    setIsLoading(true);
    try {
      const { error } = await addtoCart({ wishlistProDucts: items });
      if (error) throw new Error(error);

      toast.success(
        isMultiple ? "All items added to cart!" : "Item added to cart!",
      );
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add item(s) to cart. Please try again.");
    } finally {
      setIsLoading(false);
      closeModal();
    }
  }, []);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setSortAnchorEl(null);
  };

  const handleFilterChange = (newFilterBy) => {
    console.log('newFilterBy:', newFilterBy);
    setFilterBy(newFilterBy);
    setFilterAnchorEl(null);
  };

  const openModal = (type, item = null) =>
    setModalState({ open: true, type, item });
  const closeModal = () =>
    setModalState({ open: false, type: null, item: null });

  // const handleClickOutside = useCallback((event) => {
  //   if (sortAnchorEl && !sortAnchorEl.contains(event.target)) {
  //     setSortAnchorEl(null);
  //   }
  //   if (filterAnchorEl && !filterAnchorEl.contains(event.target)) {
  //     setFilterAnchorEl(null);
  //   }
  // }, [sortAnchorEl, filterAnchorEl]);

  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [handleClickOutside]);

  useEffect(() => {
    fetchWishlistProductData();
  }, [fetchWishlistProductData]);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading && wishlistProducts.length === 0) {
    return createPortal(<SimpleBackdrop open={true} />, document.body);
  }

  return (
    <div className="wishlist-page-container">
      {createPortal(<SimpleBackdrop open={isLoading} />, document.body)}

      {!customerId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wishlist-login-prompt"
        >
          Please login to sync your wishlist across devices
        </motion.div>
      )}

      {wishlistProducts.length > 0 && (
        <div className="wishlist-header">
          <div className="wishlist-title">
            <h1>My Wishlist</h1>
            <span className="wishlist-count">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="wishlist-actions-bar">
            <div className="wishlist-filters">
              <IconButton
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
                className="filter-button"
                aria-label="Sort items"
              >
                <SortIcon />
              </IconButton>              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
                disableScrollLock
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              ><MenuItem className="smaller-menu-item" onClick={() => handleSortChange("dateAdded")}>
                  Date Added
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleSortChange("priceHighToLow")}>
                  Price: High to Low
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleSortChange("priceLowToHigh")}>
                  Price: Low to High
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleSortChange("nameAZ")}>
                  Name: A to Z
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleSortChange("nameZA")}>
                  Name: Z to A
                </MenuItem>
              </Menu>

              <IconButton
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                className="filter-button"
                aria-label="Filter items"
              >
                <FilterListIcon />
              </IconButton>              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => setFilterAnchorEl(null)}
                disableScrollLock
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              ><MenuItem className="smaller-menu-item" onClick={() => handleFilterChange("all")}>
                  All Items
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleFilterChange("inStock")}>
                  In Stock
                </MenuItem>
                <MenuItem className="smaller-menu-item" onClick={() => handleFilterChange("outOfStock")}>
                  Out of Stock
                </MenuItem>
              </Menu>
            </div>

            <div className="wishlist-bulk-actions">
              <button
                className="wishlist-action-button"
                onClick={() => openModal("clearAll")}
              >
                <DeleteOutlineIcon />
                Clear All
              </button>
              <button
                className="wishlist-action-button"
                onClick={() => handleAddToCart(wishlistProducts, true)}
              >
                <AddShoppingCartIcon />
                Add All to Cart
              </button>
              <button
                onClick={handleShareWishlist}
                className="wishlist-action-button share"
                aria-label="Share Wishlist"
              >
                <ShareIcon />
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {wishlistProducts.length === 0 ? (
        <motion.div
          className="empty-wishlist-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FavoriteBorderIcon className="empty-wishlist-icon" />
          <h2 className="empty-wishlist-title">Your Wishlist is Empty</h2>
          <p className="empty-wishlist-message">
            Start adding items to your wishlist as you explore our store!
          </p>
          <a href="/" className="empty-wishlist-shop-button">
            Start Shopping
          </a>
        </motion.div>
      ) : (
        <motion.div
          className="wishlist-container"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {displayedProducts.map((item) => {
              const isAvailable =
                item.availableForSale !== false &&
                item.variants?.edges?.[0]?.node?.availableForSale !== false;

              const hasDiscount =
                item.compareAtPriceRange?.minVariantPrice?.amount >
                item.priceRangeV2?.minVariantPrice?.amount;

              return (
                <motion.div
                  key={item.id}
                  className="wishlist-card"
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="wishlist-image-container">
                    <img
                      className="wishlist-product-image"
                      src={
                        item?.media?.edges[0]?.node?.preview?.image?.url ||
                        item?.featuredImage?.url
                      }
                      alt={item.title}
                      loading="lazy"
                    />
                    {!isAvailable && (
                      <div className="out-of-stock-overlay">Out of Stock</div>
                    )}
                  </div>

                  <div className="wishlist-info">
                    <a
                      href={item.url || `/products/${item.handle}`}
                      className="wishlist-product-title"
                      title={item.title}
                    >
                      {item.title}
                    </a>

                    <div className="wishlist-product-details">
                      <div className="wishlist-price-container">
                        <p className="wishlist-product-price">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency:
                              item.priceRangeV2?.minVariantPrice
                                ?.currencyCode || "USD",
                          }).format(item.priceRangeV2?.minVariantPrice?.amount)}
                        </p>
                        {hasDiscount && (
                          <p className="wishlist-product-compare-price">
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency:
                                item.compareAtPriceRange.minVariantPrice
                                  .currencyCode,
                            }).format(
                              item.compareAtPriceRange.minVariantPrice.amount,
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="wishlist-item-actions">
                    <button
                      onClick={() => handleAddToCart([item])}
                      className="item-action-button add-to-cart-button"
                      disabled={!isAvailable}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 18 }} />
                      <span>
                        {isAvailable ? "Add to Cart" : "Out of Stock"}
                      </span>
                    </button>
                    <button
                      onClick={() => openModal("removeOne", item)}
                      className="item-action-button remove-button"
                      aria-label={`Remove ${item.title} from wishlist`}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {modalState.open &&
        createPortal(
          <WishlistModal
            closeModal={closeModal}
            handleConfirm={() => {
              switch (modalState.type) {
                case "removeOne":
                  handleDeleteWishlist("RemoveOne", modalState.item);
                  break;
                case "clearAll":
                  handleDeleteWishlist("clearAll");
                  break;
                default:
                  break;
              }
            }}
            message={
              modalState.type === "removeOne"
                ? `Remove "${modalState.item?.title}" from your wishlist?`
                : "Clear all items from your wishlist?"
            }
            title={modalState.type === "removeOne" ? "Remove Item" : "Clear Wishlist"}
            confirmLabel={modalState.type === "removeOne" ? "Remove" : "Clear All"}
          />,
          document.body,
        )}
    </div>
  );
};

export default MyWishlistPage;

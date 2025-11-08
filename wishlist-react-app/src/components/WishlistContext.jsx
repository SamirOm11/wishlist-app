import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { initializeNavigationListener } from "../utils/navigationmanager";

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = "wishlist-items";



export const WishlistProvider = ({ children }) => {
  // Initialize state from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem(WISHLIST_STORAGE_KEY);
      console.log('savedItems: ', savedItems);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch {
      return [];
    }
  });

  console.log('wishlistItems: ', wishlistItems);

  const [wishlistCount, setWishlistCount] = useState(wishlistItems.length);
  const [loading, setLoading] = useState(true);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === WISHLIST_STORAGE_KEY) {
        try {
          const newItems = e.newValue ? JSON.parse(e.newValue) : [];
          setWishlistItems(newItems);
          setWishlistCount(newItems.length);
        } catch (error) {
          console.error("Error parsing wishlist data from storage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist to storage:", error);
    }
  }, [wishlistItems]);

  const updateWishlist = useCallback((items) => {
    const validItems = Array.isArray(items) ? items : [];
    setWishlistItems(validItems);
    setWishlistCount(validItems.length);
  }, []);
  // Initialize navigation listener
  useEffect(() => {
    const cleanup = initializeNavigationListener(updateWishlist);
    return () => cleanup();
  }, [updateWishlist]);
  const addToWishlist = useCallback((item) => {
    if (!item?.productId) return;

    setWishlistItems((prev) => {
      if (prev.some((i) => i.productId === item.productId)) {
        return prev;
      }
      const newItems = [...prev, item];
      setWishlistCount(newItems.length);
      return newItems;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    if (!productId) return;

    setWishlistItems((prev) => {
      const newItems = prev.filter((item) => item.productId !== productId);
      setWishlistCount(newItems.length);
      return newItems;
    });
  }, []);

  const isProductInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistItems.some((item) => item.productId === productId);
    },
    [wishlistItems],
  );

const clearWishlist = (() => {
  setWishlistItems([]);
  setWishlistCount(0);
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
});

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        updateWishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        wishlistCount,
        setWishlistCount,
        loading,
        setLoading,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

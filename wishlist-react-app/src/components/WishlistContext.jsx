// import { createContext, useContext, useState, useCallback, useEffect } from "react";

// const WishlistContext = createContext();

// const WISHLIST_STORAGE_KEY = "wishlist-items-state";
// const WISHLIST_STATE_KEY = "wishlist-state"; // For backwards compatibility

// export const WishlistProvider = ({ children }) => {
//   // Initialize wishlist items from localStorage
//   const [wishlistItems, setWishlistItems] = useState(() => {
//     try {
//       const savedItems = localStorage.getItem(WISHLIST_STORAGE_KEY);
//       // Also load the old state format for backwards compatibility
//       const oldState = localStorage.getItem(WISHLIST_STATE_KEY);
//       const parsedItems = savedItems ? JSON.parse(savedItems) : [];
//       const parsedOldState = oldState ? JSON.parse(oldState) : {};
      
//       // Merge old and new state formats
//       if (Object.keys(parsedOldState).length > 0) {
//         Object.keys(parsedOldState).forEach(productId => {
//           if (parsedOldState[productId] && !parsedItems.some(item => item.productId === productId)) {
//             parsedItems.push({ productId });
//           }
//         });
//         // Save merged state and clean up old format
//         localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(parsedItems));
//         localStorage.removeItem(WISHLIST_STATE_KEY);
//       }
      
//       return parsedItems;
//     } catch {
//       return [];
//     }
//   });
  
//   const [wishlistCount, setWishlistCount] = useState(wishlistItems.length);
//   const [isAdded, setIsAdded] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Listen for storage events to sync state across tabs/pages  // Handle storage events for cross-tab/window synchronization
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       if (e.key === WISHLIST_STORAGE_KEY) {
//         try {
//           const newItems = e.newValue ? JSON.parse(e.newValue) : [];
//           setWishlistItems(newItems);
//           setWishlistCount(newItems.length);
          
//           // Update the old state format for backwards compatibility
//           const stateFormat = newItems.reduce((acc, item) => {
//             acc[item.productId] = true;
//             return acc;
//           }, {});
//           localStorage.setItem(WISHLIST_STATE_KEY, JSON.stringify(stateFormat));
//         } catch (error) {
//           console.error("Error parsing wishlist data from storage:", error);
//         }
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Save to localStorage whenever wishlist changes
//   useEffect(() => {
//     try {
//       localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
      
//       // Update the old state format for backwards compatibility
//       const stateFormat = wishlistItems.reduce((acc, item) => {
//         acc[item.productId] = true;
//         return acc;
//       }, {});
//       localStorage.setItem(WISHLIST_STATE_KEY, JSON.stringify(stateFormat));
//     } catch (error) {
//       console.error("Error saving wishlist to storage:", error);
//     }
//   }, [wishlistItems]);

//   const updateWishlist = useCallback(
//     (items) => {
//       const validItems = Array.isArray(items) ? items : [];
//       setWishlistItems(validItems);
//       setWishlistCount(validItems.length);
//     },
//     []
//   );

//   const addToWishlist = useCallback(
//     (item) => {
//       setWishlistItems((prev) => {
//         const newItems = [...prev];
//         if (!newItems.some((i) => i.productId === item.productId)) {
//           newItems.push(item);
//         }
//         setWishlistCount(newItems.length);
//         return newItems;
//       });
//     },
//     []
//   );

//   const removeFromWishlist = useCallback(
//     (productId) => {
//       setWishlistItems((prev) => {
//         const newItems = prev.filter((item) => item.productId !== productId);
//         setWishlistCount(newItems.length);
//         return newItems;
//       });
//     },
//     []
//   );

//   const isProductInWishlist = useCallback(
//     (productId) => {
//       return wishlistItems.some((item) => item.productId === productId);
//     },
//     [wishlistItems]
//   );

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         updateWishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isProductInWishlist,
//         wishlistCount,
//         setWishlistCount,
//         isAdded,
//         setIsAdded,
//         loading,
//         setLoading,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => useContext(WishlistContext);
// =====================AI updated code====================


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

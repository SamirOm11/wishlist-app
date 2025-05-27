import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount,
        setWishlistCount,
        isAdded,
        setIsAdded,
        loading,
        setLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

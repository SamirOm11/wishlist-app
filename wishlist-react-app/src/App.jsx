import "./App.css";
import AddtoWishlist from "./components/AddtoWishlist";
import MyWishlistPage from "./components/MyWishlistPage";
import { createPortal } from "react-dom";

export default function App() {
  return (
    <>
      {renderPortal(
        <AddtoWishlist />,
       "add-to-wishlist"
      )}

      {renderPortal(
        <MyWishlistPage />,
    "my-product-wishlist-id"
      )}
    </>
  );
}

const renderPortal = (Component, elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    return createPortal(Component, element);
  }
  return null;
};


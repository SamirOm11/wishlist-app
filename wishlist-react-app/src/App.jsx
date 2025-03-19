import "./App.css";
import AddtoWishlist from "./components/AddtoWishlist";
import MyWishlistPage from "./components/MyWishlistPage";
import { createPortal } from "react-dom";
import ProductCardWishlistButton from "./components/ProductCardWishlistButton";

export default function App() {
  return (
    <>
      <ProductCardWishlistButton />
      {renderPortal(<AddtoWishlist />, "add-to-wishlist")}

      {renderPortal(<MyWishlistPage />, "my-product-wishlist-id")}
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

import "./App.css";
import AddtoWishlist from "./components/AddtoWishlist";
import MyWishlistPage from "./components/MyWishlistPage";
import { createPortal } from "react-dom";
import ProductCardWishlistButton from "./components/ProductCardWishlistButton";
import { getCustomerid } from "./lib/lib";

export default function App() {
  const isCustomerLogin = getCustomerid();
  console.log("🚀 ~ App ~ isCustomerLogin:", isCustomerLogin);

  return (
    <>
      <ProductCardWishlistButton />

      {renderPortal(<AddtoWishlist />, "add-to-wishlist")}

      {isCustomerLogin
        ? renderPortal(<MyWishlistPage />, "my-product-wishlist-id")
        : ""}
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

import "./App.css";
import AddtoWishlist from "./components/AddtoWishlist";
import MyWishlistPage from "./components/MyWishlistPage";
import { createPortal } from "react-dom";
import ProductCardWishlistButton from "./components/ProductCardWishlistButton";
import { getCustomerid } from "./lib/lib";
import WishlistLauncher from "./components/WishlistLauncher";
import { WishlistProvider } from "./components/WishlistContext";
import CustomToaster from "./components/CustomToaster";

export default function App() {
  const isCustomerLogin = getCustomerid();
  console.log("🚀 ~ App ~ isCustomerLogin:", isCustomerLogin);

  return (
    <>
      <CustomToaster />
      <WishlistProvider>
        <ProductCardWishlistButton />

        {renderPortal(
          <WishlistLauncher />,
          "stensiled-wishlist-header-icon-root",
        )}

        {renderPortal(<AddtoWishlist />, "add-to-wishlist")}

        {isCustomerLogin
          ? renderPortal(<MyWishlistPage />, "product-wishlist-page")
          : ""}
      </WishlistProvider>
    </>
  );
}

//i have two components mywishlistpage and wishlistlauncher.jsx i want to transfer
// the data from mywishlistpage to wishlistlauncher.jsx how can i do that

const renderPortal = (Component, elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    return createPortal(Component, element);
  }
  return null;
};

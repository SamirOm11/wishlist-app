import "./App.css";
import AddtoWishlist from "./components/AddtoWishlist";
import MyWishlistPage from "./components/MyWishlistPage";
import { createPortal } from "react-dom";
import ProductCardWishlistButton from "./components/ProductCardWishlistButton";
import { getCustomerid } from "./lib/lib";
import WishlistLauncher from "./components/WishlistLauncher";
import { WishlistProvider } from "./components/WishlistContext";
import CustomToaster from "./components/CustomToaster";
import { useWishlist } from "./components/WishlistContext";
import { useEffect } from "react";

export default function App() {
  const isCustomerLogin = getCustomerid();
  console.log("~ App ~ isCustomerLogin:", isCustomerLogin);
  function WishlistManager({ isCustomerLogin }) {
    const { clearWishlist } = useWishlist();

    useEffect(() => {
      if (!isCustomerLogin) {
        clearWishlist();
        console.log("Wishlist cleared because customer is not logged in");
      }
    }, [isCustomerLogin]);

    return null;
  }
  return (
    <>
      <CustomToaster />
      <WishlistProvider>
        <WishlistManager isCustomerLogin={isCustomerLogin} />

        <ProductCardWishlistButton />

        {renderPortal(
          <WishlistLauncher />,
          "stensiled-wishlist-header-icon-root",
        )}

        {renderPortal(<AddtoWishlist />, "add-to-wishlist")}

        {isCustomerLogin
          ? renderPortal(<MyWishlistPage />, "product-wishlist-page")
          : renderPortal(
              <div
                id="wishlist-login-prompt-root"
                style={{
                  // Neutral background for contrast
                  backgroundColor: "#ffffff",
                  border: "1px solid #d4d4d4", // Clean silver-gray border
                  borderRadius: "12px", // Softly rounded corners for a friendly feel
                  padding: "20px 28px", // Compact, focused padding
                  textAlign: "left", // Left-aligned text feels more like a direct message
                  maxWidth: "480px", // Small and focused
                  margin: "25px auto",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Light, professional shadow
                  fontFamily: "'Inter', sans-serif",
                  color: "#18181b", // Near-black for professional contrast
                  animation: "fadeDown 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "24px",
                      marginRight: "12px",
                      color: "#A52A2A", // Rich Crimson Red accent for emotional connection
                      lineHeight: 1,
                    }}
                  >
                    📌
                  </span>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 700, // Bolder to grab attention
                      margin: "0",
                      color: "#18181b",
                    }}
                  >
                      Login Required to Save Items.
                  </p>
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    margin: "0 0 20px 36px", // Indented to align with the main text
                    color: "#525252",
                    lineHeight: "1.4",
                  }}
                >
                Please sign in to permanently secure and sync your Wishlist across all devices.
                </p>

                <div style={{ textAlign: "right" }}>
                  {" "}
                  {/* Aligns button to the right for a modern look */}
                  <a
                    href="/account/login"
                    style={{
                      backgroundColor: "#A52A2A", // Rich Crimson Red Accent
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                      padding: "10px 22px",
                      borderRadius: "50px", // Pill shape for a softer, premium button
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "all 0.25s ease",
                      border: "none",
                      boxShadow: "0 3px 6px rgba(165, 42, 42, 0.3)", // Soft accent shadow
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#8B0000"; // Darker on hover
                      e.target.style.transform = "translateY(-1px) scale(1.01)"; // Slight lift and zoom
                      e.target.style.boxShadow =
                        "0 5px 10px rgba(165, 42, 42, 0.4)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#A52A2A"; // Return to original
                      e.target.style.transform = "translateY(0) scale(1)";
                      e.target.style.boxShadow =
                        "0 3px 6px rgba(165, 42, 42, 0.3)";
                    }}
                  >
                  Login for Full Access <span style={{ marginLeft: "8px" }}>→</span>
                  </a>
                </div>

                <style>
                  {`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
                </style>
              </div>,
              "product-wishlist-page",
            )}
      </WishlistProvider>
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

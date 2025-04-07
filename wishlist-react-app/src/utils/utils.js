import axios from "axios";

export const addtoCart = async ({ wishlistProDucts }) => {
  console.log("🚀 ~ addtoCart ~ wishlistProDucts:", wishlistProDucts);
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    let items = [];

    items = wishlistProDucts.flatMap((product) => {
      if (product?.variants?.edges?.length) {
        return product.variants.edges.map((variant) => {
          const fullId = variant.node.id;
          console.log(
            "🚀 ~ returnproduct.variants.edges.map ~ fullId:",
            fullId,
          );

          const numericId = fullId.split("/").pop();
          console.log(
            "🚀 ~ returnproduct.variants.edges.map ~ numericId:",
            numericId,
          );

          if (!numericId) {
            console.error("Variant ID is missing", product);
          }

          return {
            id: numericId,
            quantity: 1,
          };
        });
      }
      return [];
    });

    console.log("Items to add to cart:", items);

    const res = await axios({
      url: "/cart/add.js",
      method: "POST",
      headers,
      data: { items },
    });

    if (res.status === 200) {
      console.log("Successfully added to cart");
      return { success: res.data };
    }
  } catch (error) {
    console.error("🚀 ~ addtoCart ~ error:", error);
    return { error };
  }
};

export const addAlltoCart = async ({ wishlistProDucts }) => {
  console.log("🚀 ~ addAlltoCart ~ wishlistProDucts:", wishlistProDucts);
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const items = wishlistProDucts.map((product) => {
      console.log("🚀 ~ items=wishlistProDucts.flatMap ~ product:", product);

      if (product?.variants?.edges?.length) {
        return product.variants.edges
          .map((variant) => {
            const fullId = variant.node.id;
            const numericId = fullId.split("/").pop();

            if (!numericId) {
              return null;
            }

            return {
              id: numericId,
              quantity: 1,
            };
          })
          .filter(Boolean);
      }

      if (product?.id) {
        const fullId = product.id;
        const numericId = fullId.split("/").pop();
        if (numericId) {
          return [
            {
              id: numericId,
              quantity: 1,
            },
          ];
        }
      }

      return [];
    });
    console.log("items", items);

    const res = await axios({
      url: "/cart/add.js",
      method: "POST",
      headers,
      data: { items },
    });

    if (res.status === 200) {
      console.log("Successfully added to cart");
      return { success: res.data };
    }
  } catch (error) {
    console.log("🚀 ~ addAlltoCart ~ error:", error);
    return { error };
  }
};

// export const displayModal = async () => {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         zIndex: 1000,
//         backgroundColor: "white",
//         borderRadius: "8px",
//         border: "1px solid rgb(228 228 228)",
//         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//         width: "1090px",
//         padding: "20px",
//       }}
//       role="dialog"
//       aria-modal="true"
//     >
//       {/* Modal Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "end",
//           alignItems: "end",
//           marginBottom: "12px",
//         }}
//       >
//         <button
//           style={{
//             background: "none",
//             color: "#333",
//             cursor: "pointer",
//             transition: "color 0.2s ease",
//             margin: "0px",
//             padding: "0px",
//             border: "none",
//             height: "30px",
//             width: "30px",
//             fontSize: "30px",
//           }}
//           onClick={handleClose}
//           onMouseEnter={(e) => (e.target.style.color = "#ff6b6b")}
//           onMouseLeave={(e) => (e.target.style.color = "#333")}
//           aria-label="Close"
//         >
//           &times;
//         </button>
//       </div>

//       {/* Modal Body */}
//       <div
//         style={{
//           padding: "20px 24px",
//           maxHeight: "calc(80vh - 100px)",
//           overflowY: "auto",
//           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//           fontSize: "16px",
//           color: "#555",
//         }}
//       >
//         <div id="stensiled-review-popup">Hello</div>
//       </div>
//     </div>
//   );
// };

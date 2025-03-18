// import React from "react";

// const ProductCardWishlistButton = () => {
//       const [productCardNodes, setProductCardNodes] = useState([]);
//   const [customProductCardButtons, setCustomProductCardButtons] = useState([]);
//   const [productLinkNodes, setProductLinkNodes] = useState([]);
//   const productLinkNodeSelector =
//     ".card-wrapper .card > .card_conttent .card_information .card_heading a";
//   const productCardWrapperSelector = ".grid_item .card-wrapper";

//   useEffect(() => {
//     const productCardNodesArray = document.querySelectorAll(
//       productCardWrapperSelector,
//     );

//     const productLinkElements = document.querySelectorAll(
//       productLinkNodeSelector,
//     );
//     let customProductcardButtonNodes = document.querySelectorAll(
//       "stensiled-wishlist-icon-button-custom-root",
//     );

//     if (customProductcardButtonNodes?.length) {
//       setCustomProductCardButtons(Array.from());
//     }

//     if (productCardNodesArray?.length) {
//       setProductLinkNodes(Array.from(productLinkElements));
//       setProductCardNodes(Array.from(productCardNodesArray));
//     }
//   }, []);

//   return <>
  
//   {/* Collection page */}

//  {
//     window.ShopifyAnalytics.meta.page.pageType === "collection" && 
//     !customProductCardButtons?.length && 

//  }

//   </>
// };

// export default ProductCardWishlistButton;

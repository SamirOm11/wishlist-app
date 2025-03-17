import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Page,
  Badge,
} from "@shopify/polaris";
import React, { useState, useEffect } from "react";


const WishlistTable = () => {
  // Initialize wishlistProduct as an empty array
  const [wishlistProduct, setWishlistProduct] = useState([]);

  console.log("wishlistProduct", wishlistProduct);

  // Resource name for IndexTable
  const resourceName = {
    singular: "product",
    plural: "products",
  };

  // Fetch wishlist data from the API
  const fetchWishlistData = async () => {
    try {
      const response = await fetch("/api/fetchwishlistdata");
      const result = await response.json();
      console.log("result", result?.wishlistData);
      // Ensure result is an array before setting the state
      if (Array.isArray(result?.wishlistData)) {
        setWishlistProduct(result?.wishlistData); // Set the wishlist as an array
      } else {
        console.error("Fetched result is not an array", result?.wishlistData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  // Managing selected resources
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(wishlistProduct);

  // Safely mapping over wishlistProduct if it's an array
  const rowMarkup = Array.isArray(wishlistProduct)
    ? wishlistProduct.map(({ id, title, handle }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {title}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{handle}</IndexTable.Cell>
          {/* You can add more cells here if needed */}
        </IndexTable.Row>
      ))
    : null; // If wishlistProduct is not an array, don't render rows

  return (
    <Page title="Wishlist Table">
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={wishlistProduct.length} // Use the actual length of the wishlist
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[{ title: "Title" }, { title: "Handle" }]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>

    </Page>
  );
};

export default WishlistTable;

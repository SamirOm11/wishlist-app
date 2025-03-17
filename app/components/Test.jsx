// import React, { useState } from "react";
// import { Card, Button, ChoiceList, TextField, Text } from "@shopify/polaris";
 
// function ProductList() {
//   const [selectedOption, setSelectedOption] = useState("specific");
//   console.log("🚀 ~ ProductList ~ selectedOption:", selectedOption)
//   const [tagInput, setTagInput] = useState("");
//   console.log("🚀 ~ ProductList ~ tagInput:", tagInput)
 
//   // Handle selection change
//   const handleSelectionChange = (value) => {
//     setSelectedOption(value);
//     console.log(`Selected option: ${value}`); // Log selected choice
//   };
 
//   // Handle tag input change
//   const handleTagInputChange = (value) => {
//     setTagInput(value);
//     console.log(`Entered Tags: ${value}`); // Log tag input
//   };
 
//   return (
//     <Card title="Trigger">
//       <Text as="p" fontWeight="bold">Offer is triggered for</Text>
 
//       <ChoiceList
//         title=""
//         choices={[
//           { label: "Specific products", value: "specific" },
//           { label: "Tags", value: "tags" },
//           { label: "All products", value: "all_products" },
//         ]}
//         selected={selectedOption}
//         onChange={handleSelectionChange}
//         allowMultiple={false}
//       />
 
//       {selectedOption === "specific" && (
//         <div style={{ marginTop: "10px" }}>
//           <Button
//             variant="primary"
//             onClick={() => console.log("Clicked Select Products button")}
//           >
//             Select Products
//           </Button>
//           <Text as="p" color="success">You selected: Specific Products</Text>
//         </div>
//       )}
 
//       {selectedOption === "tags" && (
//         <div style={{ marginTop: "10px" }}>
//           <TextField
//             label="Select Tags"
//             value={tagInput}
//             onChange={handleTagInputChange}
//             placeholder="E.g., Vintage, Summer"
//           />
//           <Text as="a" variant="bodySm" fontWeight="medium" href="#">
//             View all tags
//           </Text>
//           <Text as="p" color="success">You selected: Tags</Text>
//         </div>
//       )}
 
//       {selectedOption === "all_products" && (
//         <Text as="p" color="success" style={{ marginTop: "10px" }}>
//           You selected: All Products
//         </Text>
//       )}
 
//       <Text as="p" variant="bodySm" color="subdued" style={{ marginTop: "10px" }}>
//         The offer will be displayed on trigger product pages.
//       </Text>
//     </Card>
//   );
// }
 
// export default ProductList;
 
 
export const productDetails = `query getProductDetails($productIds: [ID!]!) {
    nodes(ids: $productIds) {
      ... on Product {
        id
        title
        onlineStorePreviewUrl
        handle
        description
        variants(first:1){
        edges{
          node{
            id
          }
        }
      }
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        media(first: 1) {
          edges {
            node {
              id
              preview {
                image {
                  url
                  altText
                  id
                }
              }
            }
          }
        }
      }
    }
  }`;
  
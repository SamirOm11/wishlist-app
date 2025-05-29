export const getProductid = () => {
  const resourceId = window.ShopifyAnalytics?.meta?.page?.resourceId;
  const productGid = window.ShopifyAnalytics?.meta?.product?.gid;
  if (resourceId) return `gid://shopify/Product/${resourceId}`;
  if (productGid) return productGid;
  return undefined;
};

export const getCustomerid = () => {
  const customerId = window.ShopifyAnalytics?.meta?.page?.customerId;
  if (customerId) return `gid://shopify/Customer/${customerId}`;
  return undefined;
};
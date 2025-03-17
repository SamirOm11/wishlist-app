export const getProductid = () => {
  if (window.ShopifyAnalytics.meta.page.resourceId)
    return window.ShopifyAnalytics?.meta?.page?.resourceId
      ? `gid://shopify/Product/${window.ShopifyAnalytics.meta.page.resourceId}`
      : window.ShopifyAnalytics?.meta?.product?.gid;
  return undefined;
};

export const getCustomerid = () => {
  if (window.ShopifyAnalytics.meta.page.customerId)
    return window.ShopifyAnalytics.meta.page.customerId
      ? `gid://shopify/Customer/${window.ShopifyAnalytics.meta.page.customerId}`
      : window.ShopifyAnalytics.meta.page.customerId;
      return undefined;
};


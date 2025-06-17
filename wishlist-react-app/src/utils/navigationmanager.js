// Utility to handle browser navigation and localStorage sync
export const initializeNavigationListener = (updateWishlist) => {
  // Handle back/forward navigation
  const handleNavigation = async () => {
    // Get customerId first as we need it for the API call
    const getCustomerId = () => {
      const customerId = window.ShopifyAnalytics?.meta?.page?.customerId;
      if (customerId) return `gid://shopify/Customer/${customerId}`;
      return undefined;
    };

    const customerId = getCustomerId();
    if (!customerId) return;

    try {
      // Fetch fresh wishlist data from the server
      const response = await fetch(
        `/apps/wishlist/api/fetchWishlistfromDb?customerId=${customerId}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      
      const result = await response.json();
      if (result?.wishlistdata) {
        // Update context with fresh data
        const formattedItems = result.wishlistdata.map(item => ({
          productId: item.productId,
          timestamp: item.timestamp
        }));
        updateWishlist(formattedItems);
      }
    } catch (error) {
      console.error('Error syncing wishlist during navigation:', error);
    }
  };

  // Listen for navigation events
  window.addEventListener('popstate', handleNavigation);
  
  // Also handle regular navigation by listening to route changes
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function() {
    originalPushState.apply(this, arguments);
    handleNavigation();
  };

  window.history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    handleNavigation();
  };

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handleNavigation);
    window.history.pushState = originalPushState;
    window.history.replaceState = originalReplaceState;
  };
};

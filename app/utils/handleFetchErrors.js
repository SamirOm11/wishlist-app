export const handleFetchErrors = ({ response }) => {
  if (response?.status >= 500) {
    shopify.toast.show("Server Error", { isError: true });
    return true;
  } else if (response?.status >= 400) {
    shopify.toast.show("Something went wrong", { isError: true });
    return true;
  }
};

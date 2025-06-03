//Used localstorage for fast initaial state
import { getProductid } from "../lib/lib";

const dynamicProdutId = getProductid();
console.log('dynamicProdutId: ', dynamicProdutId);

export const getLocalWishlistState = () => {   
    try {
       const local = localStorage.getItem("wishlist-state"); 
       if(!local) return false;
       const parsed = JSON.parse(local);
       return parsed[dynamicProdutId] || false;
    } catch {
        return false;
    }
}


export const setLocalWishlistState = (state) => {
  try {
    const local = localStorage.getItem("wishlist-state");
    const parsed = local ? JSON.parse(local) : {};
    console.log('parsed: ', parsed);
    parsed[dynamicProdutId] = state;
    console.log("parsed[dynamicProdutId] = state: ", parsed[dynamicProdutId]=state);
    console.log('parsed==: ', parsed);
    localStorage.setItem("wishlist-state", JSON.stringify(parsed));
  } catch (error) {
    console.error("Error setting local wishlist state:", error);
  }
};
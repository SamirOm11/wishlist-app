import mongoose from "mongoose";

const addToWishListSchema = new mongoose.Schema({
  shopURL: { type: String },
  productId: { type: String },
  customerId: { type: String },
});

const addToWishlistModel =
  mongoose.models.AddToWishlist ||
  mongoose.model("AddToWishlist", addToWishListSchema);

export default addToWishlistModel;


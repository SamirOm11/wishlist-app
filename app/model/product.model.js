import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  shopURL: { type: String },
  productId: { type: String },
});
const productDataModel =
  mongoose.models.ProductDetails ||
  mongoose.model("ProductDetails", productSchema);

export default productDataModel;

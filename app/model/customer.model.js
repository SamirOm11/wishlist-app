import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  shopURL: { type: String },
  customerId: { type: String },
});

const customerModel =
  mongoose.models.CustomerData ||
  mongoose.model("CustomerData", customerSchema);
export default customerModel;

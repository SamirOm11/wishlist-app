import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbconnection = () => {
  try {
    const dbURI = "mongodb://127.0.0.1:27017/Wishlist-DB";
    mongoose.connect(dbURI);
    console.log("connection success");
  } catch (error) {
    console.log("connection error", error);
  }
};

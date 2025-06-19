import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

 const dbconnection = () => {
  try {
    const dbURI = "mongodb://localhost:27017/Wishlist-DB";
    mongoose.connect(dbURI);
    console.log("connection success");
  } catch (error) {
    console.log("connection error", error);
  }
};

export default dbconnection
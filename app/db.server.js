import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

 const dbconnection = () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    mongoose.connect(dbURI);
    console.log("connection success");
  } catch (error) {
    console.log("connection error", error);
  }
};

export default dbconnection
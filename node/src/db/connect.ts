import mongoose from "mongoose";
import { infoLogger } from "../utils/logger/logger";

require("dotenv").config();

const url = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    if (!url)
      throw new Error(
        "MONGODB_URL is not defined in the environment variables",
      );
    await mongoose.connect(url);
    infoLogger({ status: "success", message: "connected to database successful" })
  } catch (error) {

    infoLogger({ status: "failed", message: "error connecting to database" })
    console.error("", error);
  }
};

export default connectDB;

import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

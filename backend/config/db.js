import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("");
    console.log(`MongoDB Connected: ${conn?.connection?.host}`);
  } catch (error) {
    console.log(`Error : ${error?.message}`);
    process.exit(1);
  }
};

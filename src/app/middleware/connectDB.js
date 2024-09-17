import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB is already connected.");
      return;
    }

    // Ensure the MONGO_URI is available
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;

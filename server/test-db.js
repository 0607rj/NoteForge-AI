import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing MongoDB connection...");
console.log("MongoDB URL:", process.env.MONGODB_URL ? "Found" : "NOT FOUND");

try {
    await mongoose.connect(process.env.MONGODB_URL, {
        serverSelectionTimeoutMS: 5000  
    });
    console.log("✅ MongoDB Connected Successfully!");
    console.log("Connected to:", mongoose.connection.name);
    process.exit(0);
} catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    process.exit(1);
}

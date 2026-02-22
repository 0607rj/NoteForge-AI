import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("✅ DB Connected")
    } catch (error) {
        console.log("❌ DB Error:", error.message)
        console.log("Please check your MONGODB_URL in .env file")
    }
}
export default connectDb
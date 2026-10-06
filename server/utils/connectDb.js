import mongoose from "mongoose";

mongoose.connection.on("disconnected", () => console.log("⚠️ DB Disconnected"))
mongoose.connection.on("reconnected", () => console.log("✅ DB Reconnected"))

const connectDb = async () => {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not set in .env file")
    }
    await mongoose.connect(process.env.MONGODB_URL, {
        serverSelectionTimeoutMS: 10000
    })
    console.log(`✅ DB Connected (${mongoose.connection.name})`)
}
export default connectDb

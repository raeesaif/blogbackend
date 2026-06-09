import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoURL = process.env.MONGO_CNN

const connectDB = async ()=>{
    try {
        await mongoose.connect(mongoURL)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message)
    }
}

export default connectDB
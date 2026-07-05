import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import userModel from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_CNN);

const existing = await userModel.findOne({ email: "admin@gmail.com" });
if (existing) {
    console.log("Admin already exists");
} else {
    await userModel.create({
        firstname: "Super",
        lastname: "Admin",
        email: "admin@gmail.com",
        phone: "03000000000",
        password: await bcrypt.hash("admin@123", 10),
        role: "admin",
        isFirstLogin: false
    });
    console.log("Admin created: admin@gmail.com / admin@123");
}

await mongoose.disconnect();

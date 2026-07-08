import { createUser,login,getMe,updateProfile,updatePassword } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { authSchema, loginSchema } from "../schema/authSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadSingle } from "../middleware/multer.js";
import express from "express";

const AuthRouter = express.Router()

AuthRouter.post("/auth/register",validate(authSchema),createUser)
AuthRouter.post("/auth/login",validate(loginSchema),login)
AuthRouter.get("/auth/me",authMiddleware,getMe)
AuthRouter.patch("/auth/update-profile",authMiddleware,uploadSingle("image"),updateProfile)
AuthRouter.patch("/auth/update-password",authMiddleware,updatePassword)
export default AuthRouter
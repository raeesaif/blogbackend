import { createUser,login,getMe,updateProfile } from "../controllers/authController.js";
import validate from "../middleware/validate.js";
import { authSchema, loginSchema } from "../schema/authSchema.js";
import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";

const AuthRouter = express.Router()

AuthRouter.post("/auth/register",validate(authSchema),createUser)
AuthRouter.post("/auth/login",validate(loginSchema),login)
AuthRouter.get("/auth/me",authMiddleware,getMe)
AuthRouter.patch("/auth/update-profile",authMiddleware,updateProfile)
export default AuthRouter
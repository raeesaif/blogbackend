import express from "express";
import { getAllActivities } from "../controllers/ActivityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const activityRouter = express.Router();

activityRouter.get("/activities", authMiddleware, getAllActivities);

export default activityRouter;

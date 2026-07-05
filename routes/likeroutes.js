import express from "express"
import { toggleLike,checkLike,getLikes  } from "../controllers/likeController.js"; 
import authMiddleware from "../middleware/authMiddleware.js"

const likeRoutes  = express.Router();

likeRoutes.post("/toggle-like/:blogId", authMiddleware, toggleLike);
likeRoutes.get("/check-like/:blogId", authMiddleware, checkLike);
likeRoutes.get("/get-likes/:blogId", authMiddleware, getLikes);

export default likeRoutes
import express from "express";
import { handleUploadError } from "../middleware/multer.js";
import { createBlog ,updateBlog,getAllBlogs,getSingleBlog,deleteBlog,getMyBlog, migrateWordCount} from "../controllers/blogController.js";
import validate from "../middleware/validate.js";
import { blogSchema } from "../schema/blogSchema.js";
import optionalAuth from "../middleware/optionalAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";

const BlogRouter = express.Router();

BlogRouter.post("/create-blogs", handleUploadError, validate(blogSchema), createBlog);
BlogRouter.patch("/update-blog/:id", handleUploadError, authMiddleware, updateBlog);
BlogRouter.delete("/delete-blog/:id", authMiddleware, deleteBlog)
BlogRouter.get("/blogs", optionalAuth, getAllBlogs)
BlogRouter.get("/blog/:id", optionalAuth, getSingleBlog)
BlogRouter.get("/my-blogs", authMiddleware, getMyBlog)
BlogRouter.post("/migrate-wordcount", migrateWordCount)
export default BlogRouter;
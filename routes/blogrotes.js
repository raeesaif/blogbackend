import express from "express";
import { handleUploadError } from "../middleware/multer.js";
import { createBlog } from "../controllers/blogController.js";
import validate from "../middleware/validate.js";
import { blogSchema } from "../schema/blogSchema.js";

const BlogRouter = express.Router();

BlogRouter.post("/create-blogs", handleUploadError, validate(blogSchema), createBlog);

export default BlogRouter;
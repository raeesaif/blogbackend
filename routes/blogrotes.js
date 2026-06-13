import express from "express";
import { handleUploadError } from "../middleware/multer.js";
import { createBlog ,updateBlog,getAllBlogs,getSingleBlog,deleteBlog} from "../controllers/blogController.js";
import validate from "../middleware/validate.js";
import { blogSchema } from "../schema/blogSchema.js";
import optionalAuth from "../middleware/optionalAuth.js";

const BlogRouter = express.Router();

BlogRouter.post("/create-blogs", handleUploadError, validate(blogSchema), createBlog);
BlogRouter.patch("/update-blog/:id", handleUploadError, updateBlog);
BlogRouter.get("/blogs",getAllBlogs)
BlogRouter.get("/blog/:id", optionalAuth, getSingleBlog)
BlogRouter.delete("/delete-blog/:id", deleteBlog)
export default BlogRouter;
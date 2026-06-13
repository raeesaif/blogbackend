import { addFavriteBlog ,removeFarvrite ,getFavriteBlogs} from "../controllers/favriteController.js";
import express from "express";

const FavriteRouter = express.Router();

FavriteRouter.post("/add-favrite", addFavriteBlog );
FavriteRouter.get("/favrite-blogs/:userId", getFavriteBlogs);
FavriteRouter.delete("/remove-favrite/:userId/:blogId", removeFarvrite);

export default FavriteRouter;
import mongoose from "mongoose";

const favriteBlog = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        blogId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"blogs",
            required:true
        }
        }
)

const favriteBlogModel = mongoose.model("favriteBlogs", favriteBlog);

export default favriteBlogModel;
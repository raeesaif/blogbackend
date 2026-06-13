import favriteBlogModel from "../models/favriteBlog.js";

const addFavriteBlog = async(req,res,next)=>{
    try {
        const {userId,blogId} = req.body;

        const newFavriteBlog = new favriteBlogModel({
            userId,
            blogId
        })

        await newFavriteBlog.save();

        res.status(201).json({
            message:"Blog added to favrite successfully"
        })

    } catch (error) {
        next(error)
    }
}

const getFavriteBlogs = async(req,res,next)=>{
    try {
        const {userId} = req.params;
        const favriteBlogs = await favriteBlogModel.find({userId}).populate("blogId");
        res.status(200).json({
            success:true,
            data:favriteBlogs
        })
    } catch (error) {
        next(error)
    }
}

const removeFarvrite = async(req,res,next)=>{
    try {
        const {userId,blogId} = req.params;

        const favriteBlog = await favriteBlogModel.findOneAndDelete({userId,blogId});
        if(!favriteBlog) return res.status(404).json({message:"Blog not found in favrite list"});
        res.status(200).json({
            message:"Blog removed from favrite successfully"
        })
    } catch (error) {
        next(error)
    }
}

export { addFavriteBlog,removeFarvrite,getFavriteBlogs  };
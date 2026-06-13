import { success } from "zod";
import cloudinary from "../config/cloudinary.js";
import blogModel from "../models/Blog.js";

const createBlog = async (req, res, next) => {
  try {
    const { title, content, category, coverImage } = req.body;

    let imageUrl = coverImage;
    let publicId = null;

    // If user uploaded a file
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "blog",
        }
      );

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    const newBlog = await blogModel.create({
      title,
      content,
      category,
      coverImage: imageUrl,
      coverImagePublicId: publicId,
      author: req.user?.id || req.body.author,
    });

    res.status(201).json({
      success: true,
      data: newBlog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async(req,res,next)=>{
    try {
        const {title,content,coverImage,category} = req.body
        const UpdateBlog = await blogModel.findByIdAndUpdate(
            req.params.id,
            {title,content,coverImage,category},
            {returnDocument:"after"}
        )
        res.status(200).json({
            success:true,
            data:UpdateBlog
        })
    } catch (error) {
        next(error)
    }
}

const getAllBlogs = async(req,res,next)=>{
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalpages = await blogModel.countDocuments();
    try {
        const blogs = await blogModel.find().populate("author","firstname lastname email").skip(skip).limit(limit);
        res.status(200).json({
            success:true,
            totalpages:Math.ceil(totalpages/limit),
            page,
            limit,
            data:blogs,
          
        })
    } catch (error) {
        next(error)
    }
}

const getSingleBlog = async(req,res,next)=>{
    try {
        const userId = req.user?.id;
        
        // If user is not logged in, return blog without counting view
        if (!userId) {
            const blog = await blogModel
                .findById(req.params.id)
                .populate("author", "firstname lastname email");
                
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            
            return res.status(200).json({
                success: true,
                data: blog
            });
        }
        
        // User is logged in, check if they've viewed before and increment
        const blog = await blogModel.findOneAndUpdate(
            {
                _id: req.params.id,
                viewedBy: { $ne: userId }
            },
            {
                $inc: { views: 1 },
                $push: { viewedBy: userId }
            },
            { returnDocument: "after" }
        ).populate("author", "firstname lastname email");
        
        // If blog was updated (user hasn't viewed before)
        if (blog) {
            return res.status(200).json({
                success: true,
                data: blog
            });
        }
        
        // User already viewed, just return the blog
        const existingBlog = await blogModel
            .findById(req.params.id)
            .populate("author", "firstname lastname email");
            
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        
        return res.status(200).json({
            success: true,
            data: existingBlog
        });
    } catch (error) {
        next(error);
    }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};



export { createBlog , updateBlog, getAllBlogs, getSingleBlog,deleteBlog};
import cloudinary from "../config/cloudinary.js";
import blogModel from "../models/blog.js";

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

export { createBlog };
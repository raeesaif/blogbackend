import likeModel from "../models/likeBlog.js";
import blogModel from "../models/Blog.js";

const toggleLike = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existingLike = await likeModel.findOne({ user: userId, blog: blogId });

    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);
      const updatedBlog = await blogModel.findByIdAndUpdate(blogId, { $inc: { likes: -1 } }, { new: true });
      return res.status(200).json({ success: true, liked: false, message: "Like removed", likes: updatedBlog.likes });
    }

    await likeModel.create({ user: userId, blog: blogId });
    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, { $inc: { likes: 1 } }, { new: true });

    return res.status(201).json({ success: true, liked: true, message: "Blog liked", likes: updatedBlog.likes });
  } catch (error) {
    next(error);
  }
};

const getLikes = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const likes = await likeModel.countDocuments({ blog: blogId });
    res.status(200).json({ success: true, totalLikes: likes });
  } catch (error) {
    next(error);
  }
};

const checkLike = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const like = await likeModel.findOne({ user: req.user.id, blog: blogId });
    res.status(200).json({ success: true, liked: !!like });
  } catch (error) {
    next(error);
  }
};

export { toggleLike, checkLike, getLikes };

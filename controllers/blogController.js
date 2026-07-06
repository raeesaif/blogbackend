import cloudinary from "../config/cloudinary.js";
import blogModel from "../models/Blog.js";
import likeModel from "../models/likeBlog.js";

const createBlog = async (req, res, next) => {
    try {
        const { title, content, category, coverImage, status } = req.body;

        let imageUrl = coverImage;
        let publicId = null;

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "blog",
            });
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
            status: status,
            wordCount: content ? content.trim().split(/\s+/).length : 0,
        });

        res.status(201).json({
            success: true,
            data: newBlog,
        });
    } catch (error) {
        next(error);
    }
};

const updateBlog = async (req, res, next) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        const userId = req.user?.id || req.user?._id;
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this blog" });
        }
        const { title, content, coverImage, category, status } = req.body;
        const updateData = { title, content, coverImage, category };
        if (content) updateData.wordCount = content.trim().split(/\s+/).length;
        if (status && ["draft", "published"].includes(status)) {
            updateData.status = status;
        }
        const updatedBlog = await blogModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ success: true, data: updatedBlog });
    } catch (error) {
        next(error);
    }
};

const getAllBlogs = async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const sortBy = req.query.sortBy; // newest | most_liked | shortest_read
    const search = req.query.search;

    const query = { status: "published" };
    if (category) query.category = category;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
        ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "most_liked") sortOption = { likes: -1 };
    else if (sortBy === "shortest_read") sortOption = { wordCount: 1 };

    if (sortBy === "newest") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query.createdAt = { $gte: sevenDaysAgo };
    }
    if (sortBy === "most_liked") query.$and = [{ likes: { $exists: true } }, { likes: { $gt: 0 } }];

    try {
        const total = await blogModel.countDocuments(query);

        if (total === 0) {
            const emptyMessages = {
                most_liked: "No liked blogs yet. Be the first to like a blog!",
                newest: "No new blogs published in the last 7 days.",
                shortest_read: "No blogs found.",
            };
            return res.status(200).json({
                success: true,
                count: 0,
                total: 0,
                totalpages: 0,
                page,
                limit,
                message: emptyMessages[sortBy] || "No blogs found.",
                data: [],
            });
        }

        const blogs = await blogModel
            .find(query)
            .populate("author", "firstname lastname email")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const blogsData = blogs.map(blog => ({
            ...blog.toObject(),
            likes: blog.likes || 0,
            likesLabel: `${blog.likes || 0} ${blog.likes === 1 ? "like" : "likes"}`,
            views: blog.views || 0,
            readTime: blog.readTime,
        }));

        const userId = req.user?.id;
        let likedBlogIds = new Set();
        if (userId) {
            const userLikes = await likeModel.find({ user: userId, blog: { $in: blogs.map(b => b._id) } }, "blog");
            likedBlogIds = new Set(userLikes.map(l => l.blog.toString()));
        }

        res.status(200).json({
            success: true,
            count: blogsData.length,
            total,
            totalpages: Math.ceil(total / limit),
            page,
            limit,
            data: blogsData.map(blog => ({ ...blog, liked: likedBlogIds.has(blog._id.toString()) })),
        });
    } catch (error) {
        next(error);
    }
};

const getSingleBlog = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            const blog = await blogModel.findById(req.params.id).populate("author", "firstname lastname email");
            if (!blog) return res.status(404).json({ message: "Blog not found" });
            return res.status(200).json({ success: true, data: { ...blog.toObject(), likes: blog.likes || 0, likesLabel: `${blog.likes || 0} ${blog.likes === 1 ? "like" : "likes"}`, views: blog.views || 0, readTime: blog.readTime, liked: false } });
        }

        const blog = await blogModel.findOneAndUpdate(
            { _id: req.params.id, viewedBy: { $ne: userId } },
            { $inc: { views: 1 }, $push: { viewedBy: userId } },
            { new: true }
        ).populate("author", "firstname lastname email");

        const targetBlog = blog || await blogModel.findById(req.params.id).populate("author", "firstname lastname email");
        if (!targetBlog) return res.status(404).json({ message: "Blog not found" });

        const userLike = await likeModel.findOne({ user: userId, blog: req.params.id });
        return res.status(200).json({ success: true, data: { ...targetBlog.toObject(), likes: targetBlog.likes || 0, likesLabel: `${targetBlog.likes || 0} ${targetBlog.likes === 1 ? "like" : "likes"}`, views: targetBlog.views || 0, readTime: targetBlog.readTime, liked: !!userLike } });
    } catch (error) {
        next(error);
    }
};

const getMyBlog = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const search = req.query.search;

        const query = { author: userId };
        if (status && ["draft", "published"].includes(status)) query.status = status;
        if (search) query.title = { $regex: search, $options: "i" };

        const total = await blogModel.countDocuments(query);
        const myblogs = await blogModel
            .find(query)
            .populate("author", "firstname lastname email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: myblogs.length,
            total,
            totalpages: Math.ceil(total / limit),
            page,
            limit,
            data: myblogs.map(blog => ({ ...blog.toObject(), likes: blog.likes || 0, views: blog.views || 0 })),
        });
    } catch (error) {
        next(error);
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        const blog = await blogModel.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

        const userId = req.user?.id || req.user?._id;
        const isOwner = blog.author.toString() === userId;
        const isAdmin = req.user?.role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this blog" });
        }

        await blogModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const migrateWordCount = async (req, res, next) => {
    try {
        const blogs = await blogModel.find({});
        const updates = blogs.map(blog => ({
            updateOne: {
                filter: { _id: blog._id },
                update: { $set: { wordCount: blog.content ? blog.content.trim().split(/\s+/).length : 0 } }
            }
        }));
        await blogModel.bulkWrite(updates);
        res.status(200).json({ success: true, message: `Updated wordCount for ${blogs.length} blogs` });
    } catch (error) {
        next(error);
    }
};

export { createBlog, updateBlog, getAllBlogs, getSingleBlog, deleteBlog, getMyBlog, migrateWordCount };

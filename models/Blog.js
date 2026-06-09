import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String, // Cloudinary URL
      required: true,
    },

    coverImagePublicId: {
      type: String, // Cloudinary public_id
    },

    category: {
      type: String,
      enum: [
        "technology",
        "lifestyle",
        "travel",
        "health",
        "business",
        "education",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.model("blogs", blogSchema);

export default blogModel;
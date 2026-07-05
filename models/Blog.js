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
      type: String,
      required: true,
    },

    coverImagePublicId: {
      type: String,
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
      ref: "users",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    viewedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

blogSchema.virtual("readTime").get(function () {
  const words = this.content ? this.content.trim().split(/\s+/).length : 0;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
});

const blogModel = mongoose.model("blogs", blogSchema);

export default blogModel;

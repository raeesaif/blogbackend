import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can like one blog only once
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

const likeModel = mongoose.model("Like", likeSchema);

export default likeModel
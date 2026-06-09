import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),

  content: z
    .string({ required_error: "Content is required" })
    .trim()
    .min(20, "Content must be at least 20 characters"),

  category: z.enum(
    ["technology", "lifestyle", "travel", "health", "business", "education"],
    { required_error: "Category is required" }
  ),

  coverImage: z
    .string({ required_error: "Cover image is required" })
    .url("Cover image must be a valid URL")
    .optional()
    .or(z.literal("")),

  author: z
    .string()
    .optional()
});

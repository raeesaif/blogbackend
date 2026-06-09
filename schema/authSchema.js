import { z } from "zod";

export const authSchema = z
  .object({
    firstname: z
      .string({ required_error: "First name is required" })
      .trim()
      .min(3, "First name must be at least 3 characters")
      .max(20, "First name must be at most 20 characters"),

    lastname: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(3, "Last name must be at least 3 characters")
      .max(20, "Last name must be at most 20 characters"),

    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),

    role: z.enum(["reader", "writer", "admin"], {
      required_error: "Role is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).trim().email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6),
});
import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.array(z.string()).optional(),
  role: z
    .enum(["user", "admin", "delivery_partner", "darkstore", "Pandits"])
    .default("user"),
  isVerified: z.boolean().default(false),
  appliedFor: z
    .enum(["none", "delivery_partner", "darkstore", "Pandits"])
    .default("none"),
  createdAt: z.date().optional().default(() => new Date()),
  refreshToken: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

// For validating login attempts
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// For validating registration
export const registerSchema = userSchema
  .omit({
    role: true,
    isVerified: true,
    appliedFor: true,
    createdAt: true,
    refreshToken: true,
  })
  .extend({
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUser = z.infer<typeof registerSchema>;

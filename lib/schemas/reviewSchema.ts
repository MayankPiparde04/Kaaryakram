import { z } from "zod";

export const reviewSchema = z.object({
  user: z.string(),  // User ID
  product: z.string().optional(),  // Product ID (optional if reviewing a pandit)
  pandit: z.string().optional(),  // Pandit ID (optional if reviewing a product)
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, { message: "Please write a comment of at least 5 characters" }),
  images: z.array(z.string()).optional(),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Review = z.infer<typeof reviewSchema>;

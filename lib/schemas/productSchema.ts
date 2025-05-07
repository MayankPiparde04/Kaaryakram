import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  category: z.string().min(1, { message: "Category is required" }),
  stock: z.number().int().min(0, { message: "Stock cannot be negative" }),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  darkStore: z.string().optional(),  // DarkStore ID
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  isRefundable: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Product = z.infer<typeof productSchema>;

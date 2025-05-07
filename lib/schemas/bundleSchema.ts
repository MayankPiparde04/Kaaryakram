import { z } from "zod";

export const bundleSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  products: z.array(z.string()).min(1, { message: "At least one product is required" }),  // Array of Product IDs
  price: z.number().min(0, { message: "Price cannot be negative" }),
  discount: z.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Bundle = z.infer<typeof bundleSchema>;

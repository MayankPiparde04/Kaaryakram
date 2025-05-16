import { z } from "zod";

export const cartItemSchema = z.object({
  product: z.string(),  // Product ID
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  name: z.string().optional(),  // For display purposes
  image: z.string().optional(),  // For display purposes
  category: z.string().optional(),  // For display purposes
});

export const cartSchema = z.object({
  user: z.string(),  // User ID
  items: z.array(cartItemSchema).default([]), // Ensure items is always an array
  subtotal: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  promoCode: z.string().optional(),
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional().default(() => new Date()),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;

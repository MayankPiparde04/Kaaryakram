import { z } from "zod";

export const bookingSchema = z.object({
  user: z.string(),  // User ID
  pandit: z.string(),  // Pandit ID
  pooja: z.string(),  // Pooja ID
  date: z.date(),
  time: z.string().min(1, { message: "Time is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  specialInstructions: z.string().optional(),
  products: z.array(z.string()).optional(),  // Optional additional products
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
  paymentMethod: z.string().optional(),
  totalAmount: z.number().min(0),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Booking = z.infer<typeof bookingSchema>;

import { z } from "zod";

export const orderItemSchema = z.object({
  product: z.string(),  // Product ID
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  name: z.string().optional(),  // For display purposes
  image: z.string().optional(),  // For display purposes
});

export const orderSchema = z.object({
  user: z.string(),  // User ID
  items: z.array(orderItemSchema).min(1, { message: "At least one item is required" }),
  totalAmount: z.number().min(0),
  status: z.enum(["pending", "processing", "shipped", "out-for-delivery", "delivered", "cancelled"]).default("pending"),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
  shippingAddress: z.string().min(5, { message: "Shipping address is required" }),
  trackingId: z.string().optional(),
  deliveryPartner: z.string().optional(),  // DeliveryPartner ID
  darkStore: z.string().optional(),  // DarkStore ID
  estimatedDelivery: z.date().optional(),
  actualDelivery: z.date().optional(),
  timeline: z.array(
    z.object({
      status: z.string(),
      date: z.date(),
      completed: z.boolean(),
      description: z.string().optional(),
    })
  ).optional(),
  createdAt: z.date().optional().default(() => new Date()),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;

// For order status updates
export const orderStatusUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum(["pending", "processing", "shipped", "out-for-delivery", "delivered", "cancelled"]),
  description: z.string().optional(),
});

export type OrderStatusUpdate = z.infer<typeof orderStatusUpdateSchema>;

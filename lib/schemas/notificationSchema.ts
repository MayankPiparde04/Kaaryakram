import { z } from "zod";

export const emailNotificationSchema = z.object({
  user: z.string(),  // User ID
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  type: z.enum(["order_receipt", "verification", "general"]),
  status: z.enum(["pending", "sent", "failed"]).default("pending"),
  error: z.string().nullable().default(null),
  read: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
  sentAt: z.date().nullable().default(null),
  deliveredAt: z.date().nullable().default(null),
});

export type EmailNotification = z.infer<typeof emailNotificationSchema>;

// Push notification schema
export const pushNotificationSchema = z.object({
  user: z.string(),  // User ID
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  icon: z.string().optional(),
  clickAction: z.string().optional(),
  read: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
});

export type PushNotification = z.infer<typeof pushNotificationSchema>;

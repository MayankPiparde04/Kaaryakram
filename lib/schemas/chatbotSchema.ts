import { z } from "zod";

export const chatMessageSchema = z.object({
  sender: z.enum(["user", "chatbot"]),
  message: z.string().min(1, { message: "Message cannot be empty" }),
  createdAt: z.date().optional().default(() => new Date()),
});

export const chatbotSchema = z.object({
  user: z.string(),  // User ID
  conversationId: z.string().optional(),
  messages: z.array(chatMessageSchema),
  status: z.enum(["active", "completed", "paused"]).default("active"),
  lastUpdated: z.date().optional().default(() => new Date()),
  createdAt: z.date().optional().default(() => new Date()),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type Chatbot = z.infer<typeof chatbotSchema>;

import { z } from "zod";
import { ObjectId } from 'mongodb';

export const poojaSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
  requiredItems: z.array(z.custom((val) => {
    try {
      return ObjectId.isValid(val); // Check if it's a valid ObjectId
    } catch (err) {
      return false;
    }
  })).optional(),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  category: z.string().optional(),
  images: z.array(z.string()).optional(),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Pooja = z.infer<typeof poojaSchema>;

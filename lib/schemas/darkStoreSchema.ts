import { z } from "zod";

export const darkStoreSchema = z.object({
  name: z.string().min(2, { message: "Store name is required" }),
  owner: z.string(),  // User ID
  location: z.string().min(5, { message: "Location is required" }),
  products: z.array(z.string()).optional(),  // Array of Product IDs
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  storeSize: z.string().min(1, { message: "Please select your store size" }),
  itemCategories: z
    .array(z.string())
    .min(1, { message: "Please select at least one item category" }),
  storeDescription: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  storeImages: z.array(z.string()).optional(),
  operatingHours: z
    .string()
    .min(1, { message: "Please provide your operating hours" }),
  hasStorage: z.boolean().default(false),
  deliveryCapability: z
    .string()
    .min(1, { message: "Please select a delivery capability option" }),
  gstNumber: z.string().optional(),
  verified: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
});

export type DarkStore = z.infer<typeof darkStoreSchema>;

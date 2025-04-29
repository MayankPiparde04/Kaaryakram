// cSpell: ignore Darkstore
import { z } from "zod";

export const darkstoreSchema = z.object({
  storeName: z.string().min(1, { message: "Please enter your store name" }),
  storeType: z.string().min(1, { message: "Please select your store type" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  city: z.string().min(1, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please enter your state" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  gstNumber: z.string().optional(),
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
  agreeToTerms: z
    .boolean()
    .refine((val) => val, {
      message: "You must agree to the terms and conditions",
    }),
});

// Inferred TypeScript type (optional but helpful)
export type DarkstoreSchema = z.infer<typeof darkstoreSchema>;

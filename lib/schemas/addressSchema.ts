import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required" }),
  apartment: z.string().optional(),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  type: z.enum(["Home", "Office", "Other"]).default("Home"),
  default: z.boolean().default(false),
  userId: z.string().optional(),
});

export type Address = z.infer<typeof addressSchema>;

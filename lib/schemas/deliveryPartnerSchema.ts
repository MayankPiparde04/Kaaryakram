import { z } from "zod";

export const deliveryPartnerSchema = z.object({
  user: z.string(),  // User ID
  vehicleType: z
    .string()
    .min(1, { message: "Please select your vehicle type" }),
  licenseNumber: z
    .string()
    .min(1, { message: "Please enter your license number" }),
  experience: z
    .string()
    .min(1, { message: "Please enter your years of experience" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  city: z.string().min(1, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please enter your state" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  serviceAreas: z
    .string()
    .min(1, { message: "Please enter your service areas" }),
  availability: z
    .array(z.string())
    .min(1, { message: "Please select at least one availability option" }),
  assignedOrders: z.array(z.string()).optional(),  // Array of Order IDs
  additionalInfo: z.string().optional(),
  vehicleRegistration: z
    .string()
    .min(1, { message: "Please enter your vehicle registration number" }),
  maxDistance: z
    .string()
    .min(1, { message: "Please select the maximum distance" }),
  preferredShifts: z.array(z.string()).optional(),
  maxDeliveryWeight: z.string().optional(),
  profileImage: z.string().optional(),
  verified: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
});

export type DeliveryPartner = z.infer<typeof deliveryPartnerSchema>;

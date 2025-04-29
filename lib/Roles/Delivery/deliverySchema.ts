import { z } from "zod";

export const deliverySchema = z.object({
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
  additionalInfo: z.string().optional(),
  vehicleRegistration: z
    .string()
    .min(1, { message: "Please enter your vehicle registration number" }),
  maxDistance: z
    .string()
    .min(1, { message: "Please select the maximum distance" }),
  profileImage: z.string().optional(),
  preferredShifts: z.array(z.string()).optional(),
  maxDeliveryWeight: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions",
  }),
});

// Inferred TypeScript type (optional but helpful)
export type DeliverySchema = z.infer<typeof deliverySchema>;

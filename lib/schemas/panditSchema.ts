import { z } from "zod";

export const panditSchema = z.object({
  user: z.string(),  // User ID
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  experience: z
    .string()
    .min(1, { message: "Please enter your years of experience" }),
  specialization: z
    .string()
    .min(1, { message: "Please select your specialization" }),
  additionalSpecializations: z.array(z.string()).optional(),
  languages: z.string().min(1, { message: "Please enter languages you speak" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  city: z.string().min(1, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please enter your state" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  certificates: z.string().optional(),
  certificateFiles: z.array(z.string()).optional(),
  educationLevel: z
    .string()
    .min(1, { message: "Please select your education level" }),
  guruParampara: z.string().optional(),
  availableTimes: z.object({
    mornings: z.boolean().optional(),
    afternoons: z.boolean().optional(),
    evenings: z.boolean().optional(),
    weekends: z.boolean().optional(),
  }),
  travelDistance: z
    .string()
    .min(1, { message: "Please select your travel distance" }),
  ritualTypes: z
    .array(z.string())
    .min(1, { message: "Please select at least one ritual type" }),
  profileImage: z.string().optional(),
  poojasOffered: z.array(z.string()).optional(),  // Array of Pooja IDs
  verified: z.boolean().default(false),
  createdAt: z.date().optional().default(() => new Date()),
});

export type Pandit = z.infer<typeof panditSchema>;

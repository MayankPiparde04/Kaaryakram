import { z } from "zod";

export const verificationSchema = z.object({
  user: z.string(),
  emailToken: z.string(),
  expiresAt: z.date(),
  verified: z.boolean().default(false),
});

export type Verification = z.infer<typeof verificationSchema>;

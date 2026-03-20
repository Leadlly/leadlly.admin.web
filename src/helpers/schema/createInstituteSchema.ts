import { z } from "zod";

export const CreateInstituteFormSchema = z.object({
  name: z.string().trim().min(1, "Institute name is required"),
  subjects: z.array(z.string()).optional().default([]),
  standards: z.array(z.string()).optional().default([]),
  logo: z
    .object({ name: z.string(), type: z.string() })
    .optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  contactNumber: z.string().optional(),
  address1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
});

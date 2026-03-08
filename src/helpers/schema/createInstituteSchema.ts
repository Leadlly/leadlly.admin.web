import { z } from "zod";

export const CreateInstituteFormSchema = z.object({
  name: z.string().trim().min(1, "Institute name is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  standards: z.array(z.string()).min(1, "Please select at least one standard"),
  //   logo: z.any().optional(),
  email: z.email(),
  website: z.string().optional(),
  contactNumber: z.string().min(10, "Please enter a valid phone number"),
  address1: z.string().min(1, "Address 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string(),
  pincode: z.string().min(1, "Pincode is required"),
});

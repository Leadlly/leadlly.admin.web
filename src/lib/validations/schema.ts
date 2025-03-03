import { z } from "zod";

export const studentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  avatar: z.string().default("/student-avatar.png"),
  class: z.enum(["11", "12"], {
    required_error: "Class must be either 11 or 12",
  }),
  performanceLevel: z.enum(["excellent", "optimal", "inefficient"], {
    required_error: "Invalid performance level",
  }),
  emoji: z.string().default("👤"),
  status: z.enum(["active", "inactive"]),
  attendance: z.number().min(0).max(100),
});

export const batchSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  class: z.enum(["11", "12"], {
    required_error: "Class must be either 11 or 12",
  }),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  maxStudents: z.number().min(1, "Maximum students must be at least 1"),
  totalStudents: z.number().optional(),
  status: z.enum(["active", "inactive"]),
  teacher: z.string().min(1, "Teacher name is required"),
  icon: z.string(),
  iconBg: z.string(),
});

export type Student = z.infer<typeof studentSchema>;
export type Batch = z.infer<typeof batchSchema>;

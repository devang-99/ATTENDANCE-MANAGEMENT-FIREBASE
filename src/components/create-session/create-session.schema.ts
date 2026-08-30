import { z } from "zod";
import { Batch, Subject } from "@/features/users/user.type";

export const createSessionSchema = z.object({
  sessionNo: z
    .number({
      error: "Session number is required",
    })
    .int("Session number must be a whole number")
    .positive("Session number must be greater than 0"),

  batch: z.enum(Batch, {
    error: "Please select a batch",
  }),

  subject: z.enum(Subject, {
    error: "Please select a subject",
  }),
});

export type CreateSessionFormData = z.infer<
  typeof createSessionSchema
>;
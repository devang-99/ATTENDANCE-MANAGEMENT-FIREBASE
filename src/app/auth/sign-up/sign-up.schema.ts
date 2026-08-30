import { Batch, Role, Stream, Subject } from "@/features/users/user.type";
import z from "zod";

const baseSchema = {
  displayName: z
    .string()
    .min(3, "Username should be of minimum 3 characters long"),

  email: z.string().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !val.includes(" "), {
      message: "Password must not contain spaces",
    }),

  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters"),
};

const passwordValidation = (
  data: { password: string; confirmPassword: string },
  ctx: z.RefinementCtx,
) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  }
};

export const RegisterUserSchema = z.discriminatedUnion("role", [
  z
    .object({
      ...baseSchema,
      role: z.literal(Role.STUDENT),
      batch: z.enum(Batch),
      stream: z.enum(Stream),
    })
    .superRefine(passwordValidation),

  z
    .object({
      ...baseSchema,
      role: z.literal(Role.TEACHER),
    })
    .superRefine(passwordValidation),
]);

export type RegisterFormData = z.infer<typeof RegisterUserSchema>;

// import { Batch, Role, Stream, Subject } from "@/features/users/user.type";
// import z from "zod";

// export const RegisterUserSchema = z
//   .object({
//     displayName: z
//       .string()
//       .min(3, "Username should be of minimum 3 characters long"),
//     email: z.string().email("Invalid email"),
//     role: z.enum(Role),
//     batch: z.enum(Batch),
//     stream: z.enum(Stream),
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .refine((val) => !val.includes(" "), {
//         message: "Password must not contain spaces",
//       }),
//     confirmPassword: z
//       .string()
//       .min(8, "Confirm Password not matches the above password"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ["confirmPassword"],
//     message: "Confirm Password and Password doesn't match",
//   });

// export type RegisterFormData = z.infer<typeof RegisterUserSchema>;

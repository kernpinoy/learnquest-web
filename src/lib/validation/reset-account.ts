import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const resetAccountFormSchema = z
  .object({
    userId: z.string().min(1, "User ID must be present."),
    password: z.string().min(1, "Password must not be empty."),
    confirmPassword: z.string().min(1, "Password must not be empty."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetAccount = z.infer<typeof resetAccountFormSchema>;

export const resolver = zodResolver(resetAccountFormSchema);

export const defaultValues: ResetAccount = {
  userId: "",
  password: "",
  confirmPassword: "",
};

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Login form schema
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username must not be empty.")
    .transform((str) => str.trim()),
  password: z.string().min(1, "Password must not be empty."),
});

// Infer type of login form
export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

// Export resolver
export const resolver = zodResolver(loginFormSchema);

// Export default values
export const defaultValues: LoginFormSchemaType = {
  username: "",
  password: "",
};

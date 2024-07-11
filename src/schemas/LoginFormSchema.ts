import { z } from "zod";

const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username cannot be empty." })
    .transform((str) => str.trim()),
  password: z
    .string()
    .min(1, { message: "Password cannot be empty." })
    .transform((str) => str.trim()),
});

export default LoginFormSchema;

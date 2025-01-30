import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";

export const changeUsernameFormSchema = z
  .object({
    userId: z.string().min(1, "User ID must be present"),
    username: z.string().min(1, "Username field must not be empty."),
    confirmUsername: z
      .string()
      .min(1, "Confirm username field must not be empty."),
  })
  .refine((data) => data.confirmUsername === data.username, {
    message: "Usernames does not match.",
    path: ["confirmUsername"],
  });

export type ChangeUsername = z.infer<typeof changeUsernameFormSchema>;
export const resolver = zodResolver(changeUsernameFormSchema);

export function defaultValues(userId: string): ChangeUsername {
  return {
    userId: userId,
    username: "",
    confirmUsername: "",
  };
}

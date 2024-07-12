import "server-only";

import { LoginFormSchemaType } from "~/lib/forms/login-form";

export function makeUserLogin({ username, password }: LoginFormSchemaType) {
  if (username === "jeanelle" && password === "toque") {
    return {
      success: "Successfully logged in!",
    };
  }

  return {
    error: "Invalid username or password.",
  };
}

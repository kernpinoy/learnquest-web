"use server";

import { LoginFormSchemaType } from "~/lib/forms/login-form";

interface ActionResponse {
  type: "SUCCESS" | "ERROR";
  message: string;
}

export async function loginAction(
  values: LoginFormSchemaType
): Promise<ActionResponse> {
  try {
    if (values.username === "jeanelle" && values.password === "toque") {
      return {
        type: "SUCCESS",
        message: "Successfully logged in.",
      };
    }

    return {
      type: "ERROR",
      message: "Username or password incorrect. Try again.",
    };
  } catch (e: any) {
    return {
      type: "ERROR",
      message: "Something went wrong! Please try again.",
    };
  }
}

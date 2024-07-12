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
    } else {
      return {
        type: "ERROR",
        message: "Invalid username or password.",
      };
    }
  } catch (e: any) {
    return {
      type: "ERROR",
      message: "Something went wrong! Please try again.",
    };
  }
}

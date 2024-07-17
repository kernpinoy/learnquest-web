"use server";

import { lucia } from "~/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "~/lib/validate-request";

export default async function logoutAccountAction() {
  // check if session is present
  const { session } = await validateRequest();

  // FIXME: logic is ok, but code not
  if (!session) {
    console.log("IllegalIllegal");
    return;
  }

  // Invalidate session
  await lucia.invalidateSession(session?.id);

  // Create blank cookie
  const sessionCookie = lucia.createBlankSessionCookie();

  // Share the cookie to browser
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // Redirect to login page
  return redirect("/");
}

"use server";

import { lucia } from "~/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "~/lib/validate-request";

export default async function logoutAccountAction() {
  const { session } = await validateRequest();

  if (!session) {
    console.log("IllegalIllegal");
    return;
  }

  await lucia.invalidateSession(session?.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

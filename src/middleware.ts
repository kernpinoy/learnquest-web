import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { validateRequest } from "~/auth/validate-request";
import { lucia } from "./auth";

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  /*  const sessionId = cookies().get(lucia.sessionCookieName);

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
 */
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/teacher/:path*", "/login"],
};

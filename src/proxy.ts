import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUser } from "./actions/user_actions";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("leadlly.in_admin_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/google/auth");

  // If user is not logged in and trying to access protected routes
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and trying to access login page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && !isPublicPath) {
    const user = await getUser();

    if (
      user &&
      user.admin &&
      user.admin.institutes.length === 0 &&
      pathname !== "/create-institute"
    ) {
      return NextResponse.redirect(new URL("/create-institute", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

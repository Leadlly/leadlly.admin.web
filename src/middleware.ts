import { NextRequest, NextResponse } from "next/server";

import { getUser, verifyAuthToken } from "./actions/user_actions";
import { cookies } from "next/headers"; 

export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  // const searchParams = request.nextUrl.searchParams;

  // if (path.startsWith("/subscription-plans") && searchParams.has("token")) {
  //   const token = searchParams.get("token");

  //   try {
  //     const response = await verifyAuthToken(token || "");

  //     if (token && response.isValidToken) {
  //       const response = NextResponse.next();

  //       response.cookies.set("token", token, {
  //         httpOnly: true,
  //         path: "/",
  //         sameSite: "strict",
  //         expires: new Date("9999-12-31T23:59:59Z"),
  //       });

  //       return response;
  //     } else {
  //       return NextResponse.redirect(new URL("/login", request.url));
  //     }
  //   } catch (error) {
  //     console.error("Error verifying token:", error);
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  // const token = await getTokenFromStorage(request); 
  // const userData = await getUser();

  // const isPublicPath =
  //   path.startsWith("/login") ||
  //   path.startsWith("/signup") ||
  //   path.startsWith("/verify") ||
  //   path.startsWith("/forgot-password") ||
  //   path.startsWith("/resetpassword");

  // if (token && isPublicPath) {
  //   return NextResponse.redirect(new URL("/", request.nextUrl));
  // }

  // if (!token && !isPublicPath) {
  //   return NextResponse.redirect(new URL("/login", request.nextUrl));
  // }

  // if (token && !isPublicPath) {
  //   const hasSubmittedInitialInfo = !!userData.user?.academic.standard;

  //   if (!hasSubmittedInitialInfo && path !== "/initial-info") {
  //     return NextResponse.redirect(new URL("/initial-info", request.nextUrl));
  //   }

  //   if (hasSubmittedInitialInfo && path === "/initial-info") {
  //     return NextResponse.redirect(new URL("/", request.nextUrl));
  //   }
  // }

  // if (token && !isPublicPath && path !== "/initial-info") {
  //   const isSubscribed = !!userData.user?.freeTrial.active === true;

  //   if (!isSubscribed && path !== "/trial-subscription") {
  //     return NextResponse.redirect(
  //       new URL("/trial-subscription", request.nextUrl)
  //     );
  //   }

  //   if (isSubscribed && path === "/trial-subscription") {
  //     return NextResponse.redirect(new URL("/", request.nextUrl));
  //   }
  // }

  // return NextResponse.next();
}

async function getTokenFromStorage(request: NextRequest) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token"); 
  return token?.value ?? ""; 
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify",
    "/resetpassword/:path*",
    "/forgot-password",
    "/",
    "/chat",
    "/error-book",
    "/growth-meter",
    "/liberty",
    "/planner",
    "/quizzes",
    "/study-room",
    "/tracker",
    "/workshops",
    "/manage-account",
    "/subscription-plans",
    "/paymentfailed",
    "/paymentsuccess",
    "/initial-info",
    "/trial-subscription",
    "/initial-study-data",
  ],
};

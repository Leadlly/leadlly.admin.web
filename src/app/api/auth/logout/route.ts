import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/api/auth/logout`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const res = NextResponse.json({ message: "Logged Out" });

    res.cookies.set("leadlly.in_admin_token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: new Date(0),
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

import { getToken } from "next-auth/jwt";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    const errorResponse = {
      timestamp: new Date().toISOString(),
      status: 401,
      error: "Unauthorized",
      message: "An error occurred during authentication.",
      fieldErrors: {
        token: "Token is invalid or missing"
      },
      generalErrors: ["Authentication failed"]
    };

    return new NextResponse(JSON.stringify(errorResponse), {
      status: 401,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

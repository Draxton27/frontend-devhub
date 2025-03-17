import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();
  if (!token) {
    url.pathname = "/api/auth/signin"; // redirect to sign-in page if not logged in
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/admin") && token.role !== "admin") {
    url.pathname = "/unauthorized"; // redirect if not an admin
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // protect all pages under /admin/
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Enforce guard on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("pafyra_token")?.value;
    
    // If no session token found in cookies, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Enforce auth page redirects when already logged in
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const token = request.cookies.get("pafyra_token")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

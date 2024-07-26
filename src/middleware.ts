import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token")?.value;

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

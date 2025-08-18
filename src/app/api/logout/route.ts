import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = NextResponse.json({ ok: true });
  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  res.cookies.set("auth-token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...(cookieDomain ? { domain: cookieDomain } as any : {}),
  });
  return res;
}

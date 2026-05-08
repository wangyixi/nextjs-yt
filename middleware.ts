import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth")

  const isHome = req.nextUrl.pathname === "/"

  // reject unauthenticated access to home page
  if (!token && isHome) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // login or sign-up page should not be accessible when authenticated
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const GUEST_ONLY = ["/", "/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("arena_token")
  const { pathname } = request.nextUrl

  // Authenticated user hitting a guest-only page → send to dashboard
  if (token && GUEST_ONLY.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Unauthenticated user hitting a protected page → send to login
  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("reason", "unauthorized")
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
}

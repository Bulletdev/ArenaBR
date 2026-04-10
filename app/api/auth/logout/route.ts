import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get("arena_token")?.value

  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }

  const res = NextResponse.json({ message: "Logout successful" })
  res.cookies.delete("arena_token")
  return res
}

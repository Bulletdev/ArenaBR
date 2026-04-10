import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("arena_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const upstream = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

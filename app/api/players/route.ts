import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("arena_token")?.value

  if (!token) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const qs = searchParams.toString()
  const url = `${API_URL}/players${qs ? `?${qs}` : ""}`

  const upstream = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "ArenaBR/1.0",
    },
  })

  const data = await upstream.json()
  console.log("[ArenaBR proxy] players status:", upstream.status, "data keys:", Object.keys(data))
  return NextResponse.json(data, { status: upstream.status })
}

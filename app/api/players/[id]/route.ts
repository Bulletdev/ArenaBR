import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("arena_token")?.value
  const { id } = await params

  if (!token) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })
  }

  const upstream = await fetch(`${API_URL}/players/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "ArenaBR/1.0",
    },
  })

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

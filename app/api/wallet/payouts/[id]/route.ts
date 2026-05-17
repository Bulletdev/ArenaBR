import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

function getHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    "User-Agent": "ArenaBR/1.0",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const { id } = await params
  const upstream = await fetch(`${API_URL}/wallet/payouts/${id}`, { headers: getHeaders(token) })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

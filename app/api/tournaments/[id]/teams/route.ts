import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

function getHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    "User-Agent": "ArenaBR/1.0",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// GET /api/tournaments/:id/teams — list enrolled teams (public)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = req.cookies.get("arena_token")?.value
  const upstream = await fetch(`${API_URL}/tournaments/${id}/teams`, {
    headers: getHeaders(token),
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

// POST /api/tournaments/:id/teams — enroll org as team
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const body = await req.json()
  const upstream = await fetch(`${API_URL}/tournaments/${id}/teams`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(body),
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

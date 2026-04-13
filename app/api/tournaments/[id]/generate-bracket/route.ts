import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

// POST /api/tournaments/:id/generate-bracket — trigger bracket generation (admin)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const upstream = await fetch(`${API_URL}/tournaments/${id}/generate_bracket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "User-Agent": "ArenaBR/1.0",
    },
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

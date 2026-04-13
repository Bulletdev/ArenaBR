import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

// GET /api/tournaments/:id/matches/:matchId — show match detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  const { id, matchId } = await params
  const token = req.cookies.get("arena_token")?.value
  const upstream = await fetch(`${API_URL}/tournaments/${id}/matches/${matchId}`, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ArenaBR/1.0",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

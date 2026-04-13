import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

// POST /api/tournaments/:id/matches/:matchId/checkin — captain checks in for their team
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  const { id, matchId } = await params
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const upstream = await fetch(`${API_URL}/tournaments/${id}/matches/${matchId}/checkin`, {
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

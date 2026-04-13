import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

// POST /api/tournaments/:id/matches/:matchId/report/admin-resolve
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  const { id, matchId } = await params
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const body = await req.json()
  const upstream = await fetch(
    `${API_URL}/tournaments/${id}/matches/${matchId}/report/admin_resolve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "ArenaBR/1.0",
      },
      body: JSON.stringify(body),
    }
  )
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

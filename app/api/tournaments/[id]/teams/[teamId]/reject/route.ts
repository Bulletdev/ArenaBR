import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

// PATCH /api/tournaments/:id/teams/:teamId/reject — admin reject team
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; teamId: string }> }
) {
  const { id, teamId } = await params
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const upstream = await fetch(`${API_URL}/tournaments/${id}/teams/${teamId}/reject`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "User-Agent": "ArenaBR/1.0",
    },
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

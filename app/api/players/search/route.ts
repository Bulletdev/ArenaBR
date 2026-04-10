import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("arena_token")?.value

  if (!token) {
    return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })
  }

  const q = new URL(req.url).searchParams.get("q") ?? ""

  const upstream = await fetch(
    `${API_URL}/players/search_riot_id?summoner_name=${encodeURIComponent(q)}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "ArenaBR/1.0",
      },
    }
  )

  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

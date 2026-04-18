import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    ""

  const upstream = await fetch(`${API_URL}/auth/player-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ArenaBR/1.0",
      ...(clientIp && { "X-Forwarded-For": clientIp }),
    },
    body: rawBody,
  })

  const data = await upstream.json()

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  const res = NextResponse.json(data)

  // Player token — mesmo cookie, mas a UI trata como contexto de jogador
  if (data?.data?.access_token) {
    res.cookies.set("arena_token", data.data.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    })
  }

  return res
}

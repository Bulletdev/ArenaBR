import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1"

function getHeaders(token?: string, idempotencyKey?: string) {
  return {
    "Content-Type": "application/json",
    "User-Agent": "ArenaBR/1.0",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("arena_token")?.value
  if (!token) return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 })

  const idempotencyKey = req.headers.get("Idempotency-Key") ?? crypto.randomUUID()
  const body = await req.text()

  const upstream = await fetch(`${API_URL}/wallet/payouts`, {
    method: "POST",
    headers: getHeaders(token, idempotencyKey),
    body,
  })
  const data = await upstream.json()
  return NextResponse.json(data, { status: upstream.status })
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDatetime(date: string): string {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Aceita tanto o tier do prostaff (DIAMOND, PLATINUM...) quanto strings legadas
export function getEloColor(elo: string | null | undefined): string {
  if (!elo) return "#E8E8E8"
  const lower = elo.toLowerCase()
  if (lower.includes("challenger") || lower.includes("grandmaster") || lower.includes("master"))
    return "#E8C97A"
  if (lower.includes("diamond") || lower.includes("diamante")) return "#57A7D6"
  if (lower.includes("emerald") || lower.includes("esmeralda")) return "#00D364"
  if (lower.includes("platinum") || lower.includes("platina")) return "#0596AA"
  if (lower.includes("gold") || lower.includes("ouro")) return "#C89B3C"
  if (lower.includes("silver") || lower.includes("prata")) return "#8896A4"
  if (lower.includes("bronze")) return "#9B6B4A"
  if (lower.includes("iron") || lower.includes("ferro")) return "#6B7280"
  return "#E8E8E8"
}

// Monta string de elo a partir dos campos do prostaff Player
export function formatRank(tier: string | null, rank: string | null, lp: number | null): string {
  if (!tier) return "Unranked"
  const tierPt: Record<string, string> = {
    IRON: "Ferro", BRONZE: "Bronze", SILVER: "Prata",
    GOLD: "Ouro", PLATINUM: "Platina", EMERALD: "Esmeralda",
    DIAMOND: "Diamante", MASTER: "Mestre", GRANDMASTER: "Grão-Mestre",
    CHALLENGER: "Challenger",
  }
  const t = tierPt[tier.toUpperCase()] ?? tier
  const r = rank ? ` ${rank}` : ""
  const l = lp != null ? ` (${lp} LP)` : ""
  return `${t}${r}${l}`
}

// Mapa de peso para ordenação por elo
export function eloWeight(tier: string | null): number {
  const order: Record<string, number> = {
    IRON: 1, BRONZE: 2, SILVER: 3, GOLD: 4, PLATINUM: 5,
    EMERALD: 6, DIAMOND: 7, MASTER: 8, GRANDMASTER: 9, CHALLENGER: 10,
  }
  return order[tier?.toUpperCase() ?? ""] ?? 0
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    top: "Top", jungle: "Jungle", mid: "Mid", adc: "ADC", support: "Suporte",
  }
  return labels[role.toLowerCase()] ?? role
}

export function getInitials(name: string): string {
  return name
    .split(/[\s#]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

export function parseRiotId(riotId: string): { gameName: string; tagLine: string } | null {
  const parts = riotId.split("#")
  if (parts.length !== 2) return null
  return { gameName: parts[0], tagLine: parts[1] }
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "ArenaBR — Campeonatos de League of Legends",
  description: "Plataforma de campeonatos amadores de League of Legends. Inscreva-se, forme seu time e compita.",
  openGraph: {
    title: "ArenaBR",
    description: "Campeonatos de LoL para o cenário amador brasileiro.",
    siteName: "ArenaBR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

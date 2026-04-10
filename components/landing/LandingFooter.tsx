import Link from "next/link"

export default function LandingFooter() {
  return (
    <footer className="relative z-10 mt-auto">
      {/* Linha gradiente topo */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C89B3C]/40 to-transparent" />

      <div
        className="px-7 py-8"
        style={{ background: "linear-gradient(to bottom, rgba(12,34,63,0.6), #070C14)" }}
      >
        <div className="mx-auto max-w-6xl">
          {/* Divisor */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C89B3C]/20 to-transparent mb-4" />

          {/* Barra inferior */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Esquerda: diamante + copyright */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rotate-45 bg-[#C89B3C]/40" />
              <span className="font-mono text-[13px] tracking-[2px] text-white/20">
                &copy; {new Date().getFullYear()} ArenaBR
              </span>
            </div>

            {/* Centro: powered by ProStaff */}
            <a
              href="https://prostaff.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-40 hover:opacity-90 transition-opacity"
            >
              <span className="font-mono text-[13px] tracking-[2px] text-white/60 uppercase">
                powered by
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/PROSTAFFLOGO.png" alt="ProStaff" style={{ height: 30, width: "auto", objectFit: "contain" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/prostaffgg.png" alt="ProStaff.gg" style={{ height: 20, width: "auto", objectFit: "contain" }} />
            </a>

            {/* Direita: aviso + diamante */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[13px] tracking-[2px] text-[#C89B3C]/30">
                BR · Season 1
              </span>
              <div className="h-1.5 w-1.5 rotate-45 bg-[#C89B3C]/40" />
            </div>
          </div>

          {/* Isenção Riot */}
          <p className="mt-4 text-center font-mono text-[10px] text-white/15">
            ArenaBR não é afiliada à Riot Games e não reflete as opiniões da Riot Games.
          </p>
        </div>
      </div>
    </footer>
  )
}

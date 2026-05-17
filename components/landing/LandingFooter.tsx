import Link from "next/link"

export default function LandingFooter() {
  return (
    <footer className="relative z-10 mt-auto">
      {/* Linha gradiente topo — crimson */}
      <div className="h-px bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

      <div
        className="px-7 py-8 bg-black"
      >
        <div className="mx-auto max-w-6xl">
          {/* Divisor */}
          <div className="h-px bg-gradient-to-r from-transparent via-crimson/20 to-transparent mb-4" />

          {/* Barra inferior */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Esquerda: diamante + copyright */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rotate-45 bg-crimson/40" />
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
              <span className="font-mono text-[13px] tracking-[2px] text-white/20">
                BR · Season 1
              </span>
              <div className="h-1.5 w-1.5 rotate-45 bg-white/20" />
            </div>
          </div>

          {/* Isencao Riot */}
          <p className="mt-4 text-center font-mono text-[10px] text-white/15">
            ArenaBR nao e afiliada a Riot Games e nao reflete as opinioes da Riot Games.
          </p>
        </div>
      </div>
    </footer>
  )
}

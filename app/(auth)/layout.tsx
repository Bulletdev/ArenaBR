import LandingNav from "@/components/landing/LandingNav"
import LandingFooter from "@/components/landing/LandingFooter"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0A0E1A] flex flex-col scanlines overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url(/bg-404.webp)" }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <LandingNav />

        <div className="flex-1 flex items-center justify-center p-6 pt-24">
          {children}
        </div>

        <LandingFooter />
      </div>
    </div>
  )
}

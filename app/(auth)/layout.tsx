import LandingNav from "@/components/landing/LandingNav"
import LandingFooter from "@/components/landing/LandingFooter"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col scanlines">
      <LandingNav />

      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        {children}
      </div>

      <LandingFooter />
    </div>
  )
}

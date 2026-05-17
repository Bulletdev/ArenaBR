import LandingNav from "@/components/landing/LandingNav"
import Hero from "@/components/landing/Hero"
import About from "@/components/landing/About"
import HowItWorks from "@/components/landing/HowItWorks"
import Championships from "@/components/landing/Championships"
import FAQ from "@/components/landing/FAQ"
import LandingFooter from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <main className="bg-black text-text overflow-x-hidden">
      <LandingNav />
      <Hero />
      <About />
      <HowItWorks />
      <Championships />
      <FAQ />
      <LandingFooter />
    </main>
  )
}

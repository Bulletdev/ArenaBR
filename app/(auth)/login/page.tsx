"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Sword, Users } from "lucide-react"
import Link from "next/link"
import RetroPanel from "@/components/ui/RetroPanel"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { useAuthStore } from "@/stores/auth"
import { authApi } from "@/lib/api"
import { cn } from "@/lib/utils"

type LoginMode = "staff" | "player"

// ─── Schemas ───────────────────────────────────────────────────
const staffSchema = z.object({
  email:    z.string().email("E-mail inválido"),
  password: z.string().min(1, "Digite sua senha"),
})

const playerSchema = z.object({
  player_email: z.string().email("E-mail inválido"),
  password:     z.string().min(1, "Digite sua senha"),
})

type StaffForm  = z.infer<typeof staffSchema>
type PlayerForm = z.infer<typeof playerSchema>

const REASON_BANNER: Record<string, { text: string; color: string }> = {
  logout:       { text: "Você saiu da plataforma com sucesso.",                            color: "border-[#252D3D] text-[#8896A4]" },
  expired:      { text: "Sua sessão expirou por segurança. Faça login novamente.",         color: "border-yellow-600/40 text-yellow-400" },
  unauthorized: { text: "Acesso negado. Faça login para continuar.",                       color: "border-red-600/40 text-red-400" },
}

function ReasonBanner() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason") ?? ""
  const banner = REASON_BANNER[reason]
  if (!banner) return null
  return (
    <div className={`border px-4 py-3 text-sm text-center ${banner.color}`}>
      {banner.text}
    </div>
  )
}

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("staff")

  return (
    <div className="w-full max-w-sm space-y-6">
      <Suspense>
        <ReasonBanner />
      </Suspense>

      <div className="text-center space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#E8E8E8] uppercase tracking-widest">
          Acessar plataforma
        </h1>
        <p className="text-[#8896A4] text-sm">Entre com sua conta ArenaBR</p>
      </div>

      {/* Toggle */}
      <div className="flex border border-[#252D3D]">
        <button
          onClick={() => setMode("staff")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors",
            mode === "staff"
              ? "bg-[#C89B3C] text-[#0A0E1A] font-bold"
              : "text-[#8896A4] hover:text-[#E8E8E8]"
          )}
        >
          <Users size={13} />
          Staff / Org
        </button>
        <button
          onClick={() => setMode("player")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest transition-colors",
            mode === "player"
              ? "bg-[#0596AA] text-[#0A0E1A] font-bold"
              : "text-[#8896A4] hover:text-[#E8E8E8]"
          )}
        >
          <Sword size={13} />
          Jogador
        </button>
      </div>

      {mode === "staff" ? <StaffLoginForm /> : <PlayerLoginForm />}

      <p className="text-center text-sm text-[#8896A4]">
        Não tem conta?{" "}
        <Link href="/register" className="text-[#C89B3C] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}

// ─── Staff login ───────────────────────────────────────────────
function StaffLoginForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
  })

  const onSubmit = async (data: StaffForm) => {
    setLoading(true)
    try {
      const res = await authApi.login(data.email, data.password)
      setAuth(res.data.user)
      toast.success("Login realizado!")
      router.push("/dashboard")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "E-mail ou senha incorretos."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RetroPanel variant="gold" corners>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Entrar como Staff
        </Button>
      </form>
    </RetroPanel>
  )
}

// ─── Player login ──────────────────────────────────────────────
function PlayerLoginForm() {
  const router = useRouter()
  const { setPlayerAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PlayerForm>({
    resolver: zodResolver(playerSchema),
  })

  const onSubmit = async (data: PlayerForm) => {
    setLoading(true)
    try {
      const res = await authApi.playerLogin(data.player_email, data.password)
      setPlayerAuth(res.data)
      toast.success("Login realizado!")
      router.push("/dashboard")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "E-mail ou senha incorretos."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RetroPanel variant="teal" corners>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail do jogador"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors.player_email?.message}
          {...register("player_email")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2 bg-[#0596AA] border-[#0596AA] hover:bg-[#047a8a]"
        >
          Entrar como Jogador
        </Button>
      </form>
    </RetroPanel>
  )
}

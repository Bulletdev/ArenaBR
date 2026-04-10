"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

type AccountType = "player" | "staff"

// ─── Player schema ─────────────────────────────────────────────
const playerSchema = z.object({
  summoner_name:        z.string().min(3, "Mínimo 3 caracteres").regex(/^.+#.+$/, "Formato: NickName#TAG"),
  player_email:         z.string().email("E-mail inválido"),
  discord_user_id:      z.string().optional(),
  password:             z.string().min(8, "Mínimo 8 caracteres"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Senhas não coincidem",
  path: ["password_confirmation"],
})

// ─── Staff schema ──────────────────────────────────────────────
const staffSchema = z.object({
  full_name: z.string().min(2, "Mínimo 2 caracteres"),
  email:     z.string().email("E-mail inválido"),
  password:  z.string().min(8, "Mínimo 8 caracteres"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Senhas não coincidem",
  path: ["password_confirmation"],
})

type PlayerData = z.infer<typeof playerSchema>
type StaffData  = z.infer<typeof staffSchema>

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType | null>(null)

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-display text-2xl font-bold text-[#E8E8E8] uppercase tracking-widest">
          Criar conta
        </h1>
        <p className="text-[#8896A4] text-sm">Junte-se à ArenaBR e comece a competir</p>
      </div>

      {!accountType ? (
        <AccountTypeSelect onSelect={setAccountType} />
      ) : accountType === "player" ? (
        <PlayerForm onBack={() => setAccountType(null)} />
      ) : (
        <StaffForm onBack={() => setAccountType(null)} />
      )}

      <p className="text-center text-sm text-[#8896A4]">
        Já tem conta?{" "}
        <Link href="/login" className="text-[#C89B3C] hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}

// ─── Step 0 — escolha de tipo ──────────────────────────────────
function AccountTypeSelect({ onSelect }: { onSelect: (t: AccountType) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        onClick={() => onSelect("player")}
        className="retro-panel border-[#252D3D] p-5 text-left hover:border-[#0596AA] hover:bg-[#1A2235] transition-all"
      >
        <Sword size={22} className="text-[#0596AA] mb-3" />
        <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider">
          Sou jogador
        </p>
        <p className="text-xs text-[#8896A4] mt-1 leading-relaxed">
          Cadastre seu Riot ID, entre como Free Agent ou com código de convite do seu time.
        </p>
      </button>

      <button
        onClick={() => onSelect("staff")}
        className="retro-panel border-[#252D3D] p-5 text-left hover:border-[#C89B3C] hover:bg-[#1A2235] transition-all"
      >
        <Users size={22} className="text-[#C89B3C] mb-3" />
        <p className="font-display font-bold text-[#E8E8E8] uppercase tracking-wider">
          Sou coach / analista / owner
        </p>
        <p className="text-xs text-[#8896A4] mt-1 leading-relaxed">
          Gerencie seu time, inscreva o elenco em campeonatos e acompanhe a performance.
        </p>
      </button>
    </div>
  )
}

// ─── Player registration ───────────────────────────────────────
function PlayerForm({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const { setPlayerAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PlayerData>({
    resolver: zodResolver(playerSchema),
  })

  const onSubmit = async (data: PlayerData) => {
    setLoading(true)
    try {
      const res = await authApi.playerRegister({
        player_email:          data.player_email,
        password:              data.password,
        password_confirmation: data.password_confirmation,
        summoner_name:         data.summoner_name,
        discord_user_id:       data.discord_user_id || undefined,
      })
      setPlayerAuth(res.data)
      toast.success("Conta criada! Você está no pool de Free Agents.")
      router.push("/dashboard")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RetroPanel variant="teal" corners>
      <button
        onClick={onBack}
        className="text-xs text-[#8896A4] hover:text-[#E8E8E8] transition-colors mb-4 block"
      >
        ← Voltar
      </button>

      <p className="retro-label mb-4">Conta de jogador</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Summoner Name (Riot ID)"
          type="text"
          autoComplete="off"
          placeholder="NickName#TAG"
          hint="Exatamente como aparece no cliente do LoL"
          error={errors.summoner_name?.message}
          {...register("summoner_name")}
        />
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors.player_email?.message}
          {...register("player_email")}
        />
        <Input
          label="Discord (opcional)"
          type="text"
          autoComplete="off"
          placeholder="usuario"
          hint="Só o nome de usuário, sem @"
          error={errors.discord_user_id?.message}
          {...register("discord_user_id")}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Criar conta de jogador
        </Button>
      </form>
    </RetroPanel>
  )
}

// ─── Staff registration ────────────────────────────────────────
function StaffForm({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<StaffData>({
    resolver: zodResolver(staffSchema),
  })

  const onSubmit = async (data: StaffData) => {
    setLoading(true)
    try {
      const res = await authApi.register({
        email:     data.email,
        password:  data.password,
        full_name: data.full_name,
      })
      if (res.data?.user) {
        setAuth(res.data.user)
        toast.success("Conta criada! Bem-vindo à ArenaBR.")
        router.push("/dashboard")
      } else {
        toast.success("Conta criada! Faça o login.")
        router.push("/login")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar conta."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RetroPanel variant="gold" corners>
      <button
        onClick={onBack}
        className="text-xs text-[#8896A4] hover:text-[#E8E8E8] transition-colors mb-4 block"
      >
        ← Voltar
      </button>

      <p className="retro-label mb-4">Conta de staff / organização</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome completo"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          error={errors.full_name?.message}
          {...register("full_name")}
        />
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
          autoComplete="new-password"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Criar conta de staff
        </Button>
      </form>
    </RetroPanel>
  )
}

"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"
import RetroPanel from "@/components/ui/RetroPanel"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const schema = z.object({
  password: z
    .string()
    .min(8, "Mínimo de 8 caracteres")
    .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter ao menos uma letra minúscula")
    .regex(/[0-9]/, "Deve conter ao menos um número"),
  password_confirmation: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "As senhas não coincidem",
  path: ["password_confirmation"],
})

type FormData = z.infer<typeof schema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password")
    }
  }, [token, router])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(body?.error?.message ?? body?.message ?? "Erro ao redefinir senha.")
      }

      toast.success("Senha redefinida com sucesso.")
      router.push("/login")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao redefinir senha."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!token) return null

  return (
    <RetroPanel variant="gold" corners>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          hint="Mínimo 8 caracteres, com maiúscula, minúscula e número"
          {...register("password")}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Redefinir senha
        </Button>
      </form>
    </RetroPanel>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm md:max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-widest">
          Redefinir senha
        </h1>
        <p className="text-[#8896A4] text-sm md:text-base">
          Crie uma nova senha para sua conta
        </p>
      </div>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-[#8896A4]">
        <Link href="/login" className="text-[#C89B3C] hover:underline">
          Voltar para login
        </Link>
      </p>
    </div>
  )
}

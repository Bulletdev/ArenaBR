"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import RetroPanel from "@/components/ui/RetroPanel"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const schema = z.object({
  email: z.string().email("E-mail inválido"),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error?.message ?? body?.message ?? "Erro ao processar solicitação.")
      }

      setSubmitted(true)
      toast.success("Solicitação enviada com sucesso.")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao processar solicitação."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm md:max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-[#E8E8E8] uppercase tracking-widest">
          Recuperar senha
        </h1>
        <p className="text-[#8896A4] text-sm md:text-base">
          Informe seu e-mail e enviaremos um link de redefinição
        </p>
      </div>

      <RetroPanel variant="gold" corners>
        {submitted ? (
          <div className="space-y-4 text-center">
            <p className="text-[#E8E8E8] text-sm font-mono leading-relaxed">
              Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha em breve.
            </p>
            <p className="text-[#8896A4] text-xs">
              Verifique também sua caixa de spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Enviar link de recuperação
            </Button>
          </form>
        )}
      </RetroPanel>

      <p className="text-center text-sm text-[#8896A4]">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-[#C89B3C] hover:underline">
          Voltar para login
        </Link>
      </p>
    </div>
  )
}

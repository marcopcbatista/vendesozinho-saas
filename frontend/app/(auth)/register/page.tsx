"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { register as registerUser, RegisterData } from "@/services/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

// âœ… Esquema de validaÃ§Ã£o com Zod
const registerSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Email invÃ¡lido"),
  phone: z.string().optional(),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
  passwordConfirmation: z.string().min(6, "Confirme sua senha"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "VocÃª deve aceitar os termos de uso" }),
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  path: ["passwordConfirmation"],
  message: "As senhas nÃ£o coincidem",
})

type FormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const payload: RegisterData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone || undefined,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
        acceptTerms: data.acceptTerms,
      }

      await registerUser(payload)
      toast.success("Conta criada com sucesso!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Criar Conta
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome completo"
              {...register("name")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Telefone (opcional)"
              {...register("phone")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              {...register("password")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar senha"
              {...register("passwordConfirmation")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              {...register("acceptTerms")}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Aceito os <a href="/termos" className="text-purple-600 underline">termos de uso</a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </main>
  )
}


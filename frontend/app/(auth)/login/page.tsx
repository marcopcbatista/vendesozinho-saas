"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { login as loginUser } from "@/services/auth"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha mínima de 6 caracteres")
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [msg, setMsg] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    const res = await loginUser(data.email, data.password)
    setMsg(res.message)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input className="w-full border p-2 mb-2" placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input type="password" className="w-full border p-2 mb-2" placeholder="Senha" {...register("password")} />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="w-full bg-green-600 text-white p-2 rounded">
          {isSubmitting ? "Entrando..." : "Login"}
        </button>
        {msg && <p className="mt-2">{msg}</p>}
      </form>
    </div>
  )
}

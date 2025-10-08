'use client'

import { useAuth } from '@/hooks/use-auth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <p>VocÃª precisa estar logado para acessar o Dashboard.</p>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Bem-vindo, {user.email}</h1>
      <button
        onClick={() => logout()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Sair
      </button>
    </div>
  )
}




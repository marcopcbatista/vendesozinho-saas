'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/auth'

export default function LogoutPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Saindo da sua conta...')
  const [error, setError] = useState(false)

  const handleLogout = async () => {
    setError(false)
    setMessage('Saindo da sua conta...')
    try {
      await logout()
      setMessage('✅ Logout realizado com sucesso! Redirecionando...')
      setTimeout(() => router.push('/login'), 2000)
    } catch (error: any) {
      console.error('Erro ao sair:', error)
      setMessage('❌ Erro ao sair. Tente novamente.')
      setError(true)
    }
  }

  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center px-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg max-w-md">
        <div className="text-6xl mb-6 animate-pulse">👋</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {message}
        </h1>
        {error && (
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all"
          >
            🔄 Tentar novamente
          </button>
        )}
        <p className="text-gray-500 dark:text-gray-400 mt-3">
          Você será redirecionado automaticamente para a página de login.
        </p>
      </div>
    </div>
  )
}

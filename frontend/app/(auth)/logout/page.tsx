'use client'
import { useState, useEffect } from 'react'
import { logout } from '@/services/auth'

export default function LogoutPage() {
  const [msg, setMsg] = useState('Saindo...')

  const handleLogout = async () => {
    try {
      await logout()
      setMsg('Logout realizado com sucesso!')
    } catch (error: any) {
      setMsg(error.message || 'Erro ao fazer logout.')
    }
  }

  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>🔒 {msg}</h1>
      <p className='text-gray-600 dark:text-gray-400'>Você será redirecionado em instantes...</p>
    </div>
  )
}

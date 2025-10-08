'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">📱</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              vendeSozinho
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
              Preços
            </Link>
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold">
              Começar Grátis
            </Link>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
            Gere textos de vendas com IA
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Crie copies que convertem em segundos
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold">
            Começar Grátis Agora
          </Link>
        </div>
      </section>
    </div>
  )
}
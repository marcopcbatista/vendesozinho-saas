'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [theme, setTheme] = useState('light')
  const [slotsRemaining, setSlotsRemaining] = useState(73)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')

    const interval = setInterval(() => {
      if (slotsRemaining > 20 && Math.random() < 0.08) {
        setSlotsRemaining(prev => prev - 1)
      }
    }, 45000)
    return () => clearInterval(interval)
  }, [slotsRemaining])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">📱</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              vendeSozinho
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Recursos
            </a>
            <a href="#results" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Resultados
            </a>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Preços
            </Link>
            
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Login
            </Link>
            
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
              Começar Grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <span className="text-2xl">🚀</span>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  +5.000 empresas transformadas
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Gere textos de vendas com{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Inteligência Artificial
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Crie copies, emails, posts e landing pages que convertem em segundos. Aumente suas vendas em até 300%.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: '⚡', number: '3x', label: 'Mais rápido' },
                  { icon: '💰', number: '300%', label: 'Conversão' },
                  { icon: '🎯', number: '15+', label: 'Templates' },
                  { icon: '🔥', number: '24/7', label: 'Disponível' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register" 
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  Começar Grátis Agora
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link 
                  href="/generator" 
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-lg rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-center"
                >
                  Ver Demo
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">⭐⭐⭐⭐⭐</span>
                  <span>4.9/5 (2.341 avaliações)</span>
                </div>
                <div>✓ Sem cartão de crédito</div>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Textos gerados hoje', value: '247', trend: '+23%', positive: true },
                    { label: 'Taxa de conversão', value: '34%', trend: '+12%', positive: true },
                    { label: 'Tempo economizado', value: '18h', trend: '+156%', positive: true }
                  ].map((metric, idx) => (
                    <div 
                      key={metric.label} 
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 transform hover:scale-105 transition-all"
                     style={{ animationDelay: `${idx * 0.1}s` }}

                    >
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{metric.label}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                      </div>
                      <span className={`text-lg font-bold px-3 py-1 rounded-lg ${metric.trend === "↑" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}` }>
                        {metric.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tudo que você precisa para vender mais com IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'IA Avançada',
                description: 'GPT-4 treinada especificamente para copywriting e vendas de alta conversão',
                features: ['15+ templates prontos', 'Personalização total', 'Múltiplos idiomas']
              },
              {
                icon: '⚡',
                title: 'Geração Rápida',
                description: 'Crie textos profissionais em segundos, não em horas',
                features: ['Resultado instantâneo', 'Múltiplas variações', 'Edição em tempo real']
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'Acompanhe métricas e otimize seus textos baseado em dados reais',
                features: ['Dashboard completo', 'Histórico ilimitado', 'Relatórios detalhados']
              }
            ].map((feature) => (
              <div 
                key={feature.title}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center text-gray-700 dark:text-gray-400">
                      <span className="text-green-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Resultados Comprovados
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Números reais de clientes reais
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '5.000+', label: 'Empresas', sublabel: 'Transformadas' },
              { number: '300%', label: 'Conversão', sublabel: 'Aumento médio' },
              { number: '10min', label: 'Economia', sublabel: 'Por texto' },
              { number: '4.9/5', label: 'Avaliação', sublabel: '2.341 reviews' }
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Comece Grátis Hoje
          </h2>
          <p className="text-2xl text-blue-100 mb-8">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/register" 
              className="px-12 py-5 bg-white text-blue-600 text-xl rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Criar Conta Grátis
            </Link>
            <Link 
              href="/pricing" 
              className="px-12 py-5 border-2 border-white text-white text-xl rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Ver Planos
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white text-sm">
            <div className="flex items-center">✓ 14 dias grátis</div>
            <div className="flex items-center">✓ Suporte prioritário</div>
            <div className="flex items-center">✓ Garantia 30 dias</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl">📱</span>
            <span className="text-xl font-bold text-white">vendeSozinho</span>
          </div>
          
          <nav className="flex gap-8">
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">Preços</Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
            <a href="#" className="text-gray-400 hover:text-white transition">Suporte</a>
          </nav>
          
          <div className="text-gray-500 text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} vendeSozinho. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}








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
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📱</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">vendeSozinho</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Recursos</a>
            <a href="#results" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Resultados</a>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Preços</Link>
            
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <Link href="/generator" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Começar Teste
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
                <span className="text-2xl">🚀</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Mais de 5.000 empresas transformadas</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Transforme seu WhatsApp em uma{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  máquina de vendas
                </span>{' '}
                automatizada
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Atenda centenas de clientes simultaneamente, feche 3x mais vendas e economize milhares com nossa plataforma de automação inteligente.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { number: '30s', label: 'Tempo resposta' },
                  { number: '15x', label: 'ROI médio' },
                  { number: '24/7', label: 'Atendimento' },
                  { number: '300%', label: 'Conversões' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generator" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center">
                  Começar Teste Grátis →
                </Link>
                <Link href="/pricing" className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center">
                  Ver Demonstração
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white">vendeSozinho Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Online • 247 leads hoje</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Conversões hoje', value: '89', change: '+23%', positive: true },
                    { label: 'Tempo resposta', value: '24s', change: '-67%', positive: true },
                    { label: 'Taxa conversão', value: '34%', change: '+156%', positive: true }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                      </div>
                      <span className={\	ext-sm font-medium \\}>
                        {metric.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="problems" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Você reconhece estes problemas?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Milhares de empresas perdem vendas todos os dias por não conseguirem atender adequadamente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📱', title: 'Leads Perdidos', desc: 'Clientes desistem porque demoram 4-8h para resposta', impact: '-60% conversões' },
              { icon: '💼', title: 'Equipe Sobrecarregada', desc: '80% do tempo em perguntas repetitivas', impact: 'R$ 8k/mês/vendedor' },
              { icon: '🌙', title: 'Vendas Perdidas', desc: '45% dos clientes mandam mensagem fora do horário', impact: '-45% oportunidades' },
              { icon: '📉', title: 'Falta de Controle', desc: 'Sem visibilidade do funil ou métricas', impact: 'Decisões cegas' }
            ].map((problem) => (
              <div key={problem.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{problem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{problem.desc}</p>
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Impacto: </span>
                  <span className="font-bold text-red-600 dark:text-red-400">{problem.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como Nossa Plataforma Resolve
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tecnologia avançada que transforma seu WhatsApp profissionalmente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Automação Inteligente',
                features: ['Respostas 24/7', 'Fluxos com IA', 'Qualificação automática', 'Agendamentos'],
                result: '80% menos tempo repetitivo'
              },
              {
                icon: '💼',
                title: 'Profissionalização',
                features: ['Múltiplos atendentes', 'Templates otimizados', 'Histórico unificado', 'Relatórios detalhados'],
                result: 'Equipe 3x mais produtiva'
              },
              {
                icon: '📊',
                title: 'Gestão Completa',
                features: ['Dashboard real-time', 'Funil visual', 'WhatsApp API', 'Integrações CRM'],
                result: 'Controle total baseado em dados'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item) => (
                    <li key={item} className="flex items-center text-gray-600 dark:text-gray-300">
                      <span className="mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    📊 Resultado: {feature.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Resultados Comprovados
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dados reais de 5.000+ empresas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { stat: '300%', label: 'Aumento conversão', detail: 'De 8% para 25%' },
              { stat: '80%', label: 'Redução tempo', detail: '4h para 30s' },
              { stat: '250%', label: 'Crescimento vendas', detail: '+R$ 85k/mês' },
              { stat: '15x', label: 'ROI médio', detail: 'Retorno em 30 dias' }
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.stat}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">🔥 Oferta Especial - Primeiros 100 Clientes</h2>
            <div className="text-6xl font-bold mb-4">50% OFF</div>
            <p className="text-2xl mb-6">nos primeiros 3 meses</p>
            <div className="flex justify-center gap-4 mb-8">
              <span className="text-3xl line-through opacity-75">R$ 297/mês</span>
              <span className="text-4xl font-bold">R$ 148/mês</span>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Bônus Inclusos (R$ 5.500)</h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li>✅ Configuração completa (R$ 1.500)</li>
                <li>✅ Treinamento personalizado (R$ 2.000)</li>
                <li>✅ Suporte premium 60 dias (R$ 1.200)</li>
                <li>✅ Templates alta conversão (R$ 800)</li>
              </ul>
            </div>
            <div className="text-xl font-bold">
              Restam apenas <span className="text-3xl">{slotsRemaining}</span> vagas
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gray-900 dark:bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Triplicar Suas Vendas?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a 5.000+ empresas que transformaram seus resultados
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            {['Teste 14 dias grátis', 'Configuração inclusa', 'Suporte premium', 'Garantia 60 dias'].map((item) => (
              <div key={item} className="flex items-center justify-center text-gray-300">
                <span className="mr-2">✅</span>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator" className="px-12 py-4 bg-blue-600 text-white text-lg rounded-lg font-bold hover:bg-blue-700 transition">
              Começar Teste Gratuito
            </Link>
            <Link href="/pricing" className="px-12 py-4 border-2 border-white text-white text-lg rounded-lg font-bold hover:bg-white hover:text-gray-900 transition">
              Ver Planos
            </Link>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg inline-block">
            <span className="text-gray-300">🛡️ Sem Riscos: Garantia total de 60 dias</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} vendeSozinho - Todos os direitos reservados
          </span>
          <nav className="flex gap-6 mt-4 md:mt-0">
            <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Preços</Link>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Termos</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Privacidade</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

// app/pricing/page.tsx
import { Metadata } from 'next'
import { Check, Crown, Zap, Users, Infinity, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preços | vendeSozinho',
  description: 'Escolha o plano ideal para acelerar suas vendas com IA',
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfeito para começar',
    price: 29,
    period: 'mês',
    icon: Zap,
    color: 'blue',
    popular: false,
    features: [
      '50 textos gerados por mês',
      '10 templates básicos',
      'Editor de copy simples',
      'Histórico de 30 dias',
      'Exportar em TXT/PDF',
      'Suporte por email'
    ],
    limits: {
      texts: '50/mês',
      templates: '10 básicos',
      support: 'Email',
      users: '1 usuário'
    }
  },
  {
    name: 'Professional',
    description: 'Para profissionais sérios',
    price: 79,
    period: 'mês', 
    icon: Crown,
    color: 'purple',
    popular: true,
    features: [
      '200 textos gerados por mês',
      '25+ templates profissionais',
      'Editor avançado com IA',
      'Histórico ilimitado',
      'Análise de performance',
      'Exportar em múltiplos formatos',
      'Integração via API',
      'Suporte prioritário'
    ],
    limits: {
      texts: '200/mês',
      templates: '25+ premium',
      support: 'Prioritário',
      users: '3 usuários'
    }
  },
  {
    name: 'Enterprise',
    description: 'Para equipes e agências',
    price: 199,
    period: 'mês',
    icon: Users,
    color: 'green',
    popular: false,
    features: [
      'Textos ilimitados',
      'Todos os templates + customização',
      'IA personalizada para sua marca',
      'White-label completo',
      'Relatórios avançados',
      'Integração com CRM/ferramentas',
      'Treinamento da equipe',
      'Suporte dedicado 24/7',
      'Gerente de conta dedicado'
    ],
    limits: {
      texts: 'Ilimitado',
      templates: 'Todos + custom',
      support: '24/7 dedicado',
      users: 'Usuários ilimitados'
    }
  }
]

const faqs = [
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos de longo prazo nem taxas de cancelamento.'
  },
  {
    question: 'O que acontece se eu exceder o limite de textos?',
    answer: 'Você receberá uma notificação quando estiver próximo do limite. Pode fazer upgrade do plano ou aguardar a renovação mensal.'
  },
  {
    question: 'Há desconto para pagamento anual?',
    answer: 'Sim! Oferecemos 20% de desconto para pagamentos anuais em todos os planos.'
  },
  {
    question: 'Posso fazer teste grátis?',
    answer: 'Oferecemos 14 dias grátis para todos os novos usuários testarem todas as funcionalidades.'
  }
]

function PlanCard({ plan }: { plan: typeof plans[0] }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50 ring-2 ring-purple-500',
    green: 'border-green-200 bg-green-50'
  }

  const buttonClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700', 
    green: 'bg-green-600 hover:bg-green-700'
  }

  return (
    <div className={`relative bg-white rounded-2xl shadow-sm p-8 ${colorClasses[plan.color as keyof typeof colorClasses]}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            plan.color === 'blue' ? 'bg-blue-100' : 
            plan.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'
          }`}>
            <plan.icon className={`w-8 h-8 ${
              plan.color === 'blue' ? 'text-blue-600' : 
              plan.color === 'purple' ? 'text-purple-600' : 'text-green-600'
            }`} />
          </div>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Recursos Inclusos */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            O que está incluído em todos os planos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA Avançada</h3>
              <p className="text-sm text-gray-600">GPT-4 para textos de alta qualidade</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sem Contratos</h3>
              <p className="text-sm text-gray-600">Cancele quando quiser</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Atualizações</h3>
              <p className="text-sm text-gray-600">Novos recursos constantemente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
              <p className="text-sm text-gray-600">Ajuda sempre que precisar</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para aumentar suas vendas?
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de empreendedores que já estão usando IA para criar textos que convertem.
            Comece seu teste grátis de 14 dias agora.
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Começar Teste Grátis
          </button>
        </div>
      </div>
    </div>
  )
}
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">R${plan.price}</span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>

        <button className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-colors ${buttonClasses[plan.color as keyof typeof buttonClasses]}`}>
          {plan.name === 'Enterprise' ? 'Falar com Vendas' : 'Começar Agora'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Textos:</span>
            <span className="font-medium text-gray-900 block">{plan.limits.texts}</span>
          </div>
          <div>
            <span className="text-gray-500">Templates:</span>
            <span className="font-medium text-gray-900 block">{plan.limits.templates}</span>
          </div>
          <div>
            <span className="text-gray-500">Suporte:</span>
            <span className="font-medium text-gray-900 block">{plan.limits.support}</span>
          </div>
          <div>
            <span className="text-gray-500">Usuários:</span>
            <span className="font-medium text-gray-900 block">{plan.limits.users}</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Preços simples e transparentes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para acelerar suas vendas com textos gerados por IA. 
            Todos os planos incluem 14 dias grátis.
          </p>
          
          {/* Toggle Anual */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-600">Mensal</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
            <span className="text-gray-900 font-medium">Anual</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              20% desconto
            </span>
          </div>
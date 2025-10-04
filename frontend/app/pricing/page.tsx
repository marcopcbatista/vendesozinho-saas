const plans = [
  { name: 'Básico', description: 'Ideal para começar', price: 49, features: ['100 textos/mês', 'Templates básicos', 'Suporte email'] },
  { name: 'Pro', description: 'Para profissionais', price: 149, features: ['500 textos/mês', 'Todos templates', 'Suporte prioritário', 'API access'] },
  { name: 'Enterprise', description: 'Solução completa', price: 499, features: ['Textos ilimitados', 'White label', 'Suporte 24/7', 'Custom AI'] }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Planos e Preços</h1>
          <p className="text-xl text-gray-600">Escolha o plano ideal para seu negócio</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">R$ {plan.price}</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                Começar Agora
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

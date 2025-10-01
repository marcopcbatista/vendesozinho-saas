const plans = [
  { name: 'Básico', description: 'Plano para iniciantes', price: 49 },
  { name: 'Profissional', description: 'Para negócios em crescimento', price: 149 },
  { name: 'Enterprise', description: 'Plano completo', price: 499 }
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-6">
      <h2 className="text-4xl font-bold text-center mb-12">Nossos Planos</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-2xl p-6 shadow">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-6">{plan.description}</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">R\</span>
              <span className="text-gray-500">/mês</span>
            </div>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold">
              Assinar agora
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

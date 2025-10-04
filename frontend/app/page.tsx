export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 max-w-4xl">
        <h1 className="text-6xl font-bold text-gray-900">
          vendeSozinho
        </h1>
        <p className="text-2xl text-gray-600">
          Gerador de Textos de Vendas com Inteligência Artificial
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a href="/generator" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Começar Agora
          </a>
          <a href="/pricing" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
            Ver Planos
          </a>
        </div>
      </div>
    </main>
  )
}

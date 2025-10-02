export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Bem-vindo ao vendeSozinho
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma SaaS para automação de vendas no WhatsApp
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/pricing" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Ver Planos
          </a>
          <a href="/dashboard" className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
            Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}

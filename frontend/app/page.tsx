export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          VendeSozinho
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma SaaS para geração de conteúdo inteligente
        </p>
        <div className="flex gap-4 justify-center">
          
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fazer Login
          </a>
          
            href="/register"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Criar Conta
          </a>
        </div>
      </div>
    </div>
  );
}

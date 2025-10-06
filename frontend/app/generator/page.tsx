// app/generator/page.tsx
import { Metadata } from 'next'
import { Sparkles, Wand2, Copy, Download, Save } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gerador de Textos | vendeSozinho',
  description: 'Gere textos de vendas profissionais com IA avanÃ§ada',
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gerador de Textos</h1>
              <p className="text-gray-600">Crie copy persuasivo com inteligÃªncia artificial</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Input */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              ConfiguraÃ§Ãµes
            </h2>

            <div className="space-y-6">
              {/* Seletor de Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Texto
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>PÃ¡gina de Vendas</option>
                  <option>Email de Vendas</option>
                  <option>AnÃºncio do Facebook</option>
                  <option>Copy para Instagram</option>
                  <option>VSL (Video Sales Letter)</option>
                  <option>Carta de Vendas</option>
                </select>
              </div>

              {/* Produto/ServiÃ§o */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Produto ou ServiÃ§o
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Curso de Marketing Digital"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* PÃºblico-alvo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  PÃºblico-alvo
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Empreendedores iniciantes"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* BenefÃ­cios principais */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Principais BenefÃ­cios
                </label>
                <textarea 
                  rows={4}
                  placeholder="Liste os principais benefÃ­cios do seu produto..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tom da comunicaÃ§Ã£o */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tom da ComunicaÃ§Ã£o
                </label>
                <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Profissional</option>
                  <option>Casual e AmigÃ¡vel</option>
                  <option>Urgente e Direto</option>
                  <option>Educativo</option>
                  <option>Inspiracional</option>
                </select>
              </div>

              {/* BotÃ£o Gerar */}
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Gerar Texto com IA
              </button>
            </div>
          </div>

          {/* Panel de Output */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Copy className="w-5 h-5 text-green-600" />
                Texto Gerado
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-96 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Aguardando configuraÃ§Ãµes</p>
                <p className="text-sm">Preencha os campos ao lado e clique em "Gerar Texto"</p>
              </div>
            </div>
          </div>
        </div>

        {/* HistÃ³rico RÃ¡pido */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GeraÃ§Ãµes Recentes</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Seus textos gerados aparecerÃ£o aqui</p>
          </div>
        </div>
      </div>
    </div>
  )
}


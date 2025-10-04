// app/history/page.tsx
import { Metadata } from 'next'
import { History, Search, Filter, Calendar, Star, Copy, Download, Trash2, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Histórico | vendeSozinho',
  description: 'Histórico completo de todos os seus textos gerados',
}

const generatedTexts = [
  {
    id: 1,
    title: 'Página de Vendas - Curso de Marketing',
    template: 'Página de Vendas Clássica',
    createdAt: '2024-03-15T10:30:00',
    wordCount: 1200,
    isFavorite: true,
    performance: {
      views: 245,
      conversions: 12,
      rate: '4.9%'
    },
    preview: 'Descubra os segredos que os especialistas em marketing não querem que você saiba...'
  },
  {
    id: 2,
    title: 'Email Sequence - Produto Digital',
    template: 'Email de Vendas',
    createdAt: '2024-03-14T16:20:00',
    wordCount: 850,
    isFavorite: false,
    performance: {
      views: 189,
      conversions: 8,
      rate: '4.2%'
    },
    preview: 'Olá [NOME], você já se perguntou por que algumas pessoas conseguem...'
  },
  {
    id: 3,
    title: 'Anúncio Facebook - Consultoria',
    template: 'Facebook Ads',
    createdAt: '2024-03-13T09:15:00',
    wordCount: 320,
    isFavorite: true,
    performance: {
      views: 1200,
      conversions: 45,
      rate: '3.8%'
    },
    preview: '🚀 Transforme seu negócio em 30 dias! Descubra como nossos clientes...'
  },
  {
    id: 4,
    title: 'VSL Script - Lançamento',
    template: 'Video Sales Letter',
    createdAt: '2024-03-12T14:45:00',
    wordCount: 2100,
    isFavorite: false,
    performance: {
      views: 89,
      conversions: 5,
      rate: '5.6%'
    },
    preview: 'Nos próximos 15 minutos, vou revelar exatamente como você pode...'
  },
  {
    id: 5,
    title: 'Post Instagram - Engajamento',
    template: 'Instagram Post',
    createdAt: '2024-03-11T11:00:00',
    wordCount: 180,
    isFavorite: false,
    performance: {
      views: 567,
      conversions: 23,
      rate: '4.1%'
    },
    preview: 'A verdade que ninguém te conta sobre empreendedorismo... 💡'
  }
]

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Histórico de Textos</h1>
              <p className="text-gray-600">Todos os seus textos gerados organizados e analisados</p>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Total de Textos</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Palavras Geradas</p>
              <p className="text-2xl font-bold text-gray-900">89,450</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Taxa Média Conversão</p>
              <p className="text-2xl font-bold text-green-600">4.4%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Favoritos</p>
              <p className="text-2xl font-bold text-yellow-600">23</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-lg p-4 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, template ou conteúdo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              Data
            </button>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500">
              <option>Todos os Templates</option>
              <option>Página de Vendas</option>
              <option>Email Marketing</option>
              <option>Social Media</option>
              <option>Vídeo</option>
            </select>
          </div>
        </div>

        {/* Lista de Textos */}
        <div className="space-y-4">
          {generatedTexts.map((text) => (
            <div key={text.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                {/* Conteúdo Principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{text.title}</h3>
                    {text.isFavorite && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {text.template}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {text.preview}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{new Date(text.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>{text.wordCount} palavras</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {text.performance.views} visualizações
                    </span>
                    <span className="text-green-600 font-medium">
                      {text.performance.conversions} conversões ({text.performance.rate})
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">Mostrando 1-5 de 127 textos</p>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              Anterior
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">2</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">3</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// app/templates/page.tsx
import { Metadata } from 'next'
import { FileText, Crown, Zap, Mail, Facebook, Instagram, Video, FileEdit } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Templates | vendeSozinho',
  description: 'Templates profissionais de copy para diferentes tipos de conteúdo',
}

const templates = [
  {
    id: 1,
    name: 'Página de Vendas Clássica',
    description: 'Template completo para páginas de vendas de alto impacto',
    category: 'Páginas',
    icon: FileText,
    isPremium: false,
    conversions: '34%',
    sections: ['Headline', 'Problema', 'Solução', 'Benefícios', 'Prova Social', 'CTA']
  },
  {
    id: 2,
    name: 'Email Sequence de Vendas',
    description: 'Sequência de 7 emails para nutrir e converter leads',
    category: 'Email',
    icon: Mail,
    isPremium: true,
    conversions: '28%',
    sections: ['Relacionamento', 'Educação', 'Objeções', 'Urgência', 'Fechamento']
  },
  {
    id: 3,
    name: 'Anúncio Facebook Ads',
    description: 'Copy otimizado para anúncios no Facebook e Instagram',
    category: 'Social Media',
    icon: Facebook,
    isPremium: false,
    conversions: '12%',
    sections: ['Hook', 'Problema', 'Solução', 'CTA']
  },
  {
    id: 4,
    name: 'Post Instagram Engajamento',
    description: 'Posts que geram engajamento e direcionam para vendas',
    category: 'Social Media',
    icon: Instagram,
    isPremium: false,
    conversions: '18%',
    sections: ['Caption', 'Hashtags', 'CTA nos Stories']
  },
  {
    id: 5,
    name: 'VSL (Video Sales Letter)',
    description: 'Script completo para vídeos de vendas de alta conversão',
    category: 'Vídeo',
    icon: Video,
    isPremium: true,
    conversions: '42%',
    sections: ['Abertura', 'História', 'Demonstração', 'Oferta', 'Fechamento']
  },
  {
    id: 6,
    name: 'Carta de Vendas Direta',
    description: 'Formato de carta tradicional adaptado para digital',
    category: 'Páginas',
    icon: FileEdit,
    isPremium: true,
    conversions: '31%',
    sections: ['Saudação', 'Problema', 'História', 'Solução', 'Garantia', 'CTA']
  }
]

const categories = ['Todos', 'Páginas', 'Email', 'Social Media', 'Vídeo']

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Templates de Copy</h1>
              <p className="text-gray-600">Modelos testados e aprovados para diferentes tipos de conteúdo</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 hover:text-gray-900"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <template.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                {template.isPremium && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Crown className="w-4 h-4" />
                    <span className="text-xs font-medium">Premium</span>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>

              {/* Estatísticas */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">{template.conversions} conversão</span>
                </div>
                <span className="text-xs text-gray-500">{template.sections.length} seções</span>
              </div>

              {/* Seções */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">Seções incluídas:</p>
                <div className="flex flex-wrap gap-1">
                  {template.sections.slice(0, 3).map((section, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {section}
                    </span>
                  ))}
                  {template.sections.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{template.sections.length - 3} mais
                    </span>
                  )}
                </div>
              </div>

              {/* Botão de Ação */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                {template.isPremium ? 'Usar Template Premium' : 'Usar Template'}
              </button>
            </div>
          ))}
        </div>

        {/* CTA Premium */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 text-center border border-yellow-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Desbloqueie Templates Premium</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Acesse mais de 50 templates premium testados por especialistas em copywriting, 
            incluindo VSLs, sequences de email avançadas e muito mais.
          </p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
            Upgrade para Premium
          </button>
        </div>
      </div>
    </div>
  )
}
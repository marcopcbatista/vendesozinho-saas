// app/not-found.tsx
import Link from 'next/link';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  const quickLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/generator', label: 'Gerador de Conteúdo', icon: Search },
    { href: '/leads', label: 'Leads', icon: HelpCircle },
    { href: '/pricing', label: 'Planos', icon: ArrowLeft },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Página Não Encontrada
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        {/* Main Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Home className="w-5 h-5" />
            Voltar para Início
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Ir para Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Links Rápidos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <link.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-600">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-3">
            Ainda não encontrou o que procura?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <HelpCircle className="w-5 h-5" />
            Entre em contato com o suporte
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Código de erro: 404 | Página não encontrada
          </p>
        </div>
      </div>
    </div>
  );
}
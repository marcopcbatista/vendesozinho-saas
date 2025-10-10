// app/payment/error/page.tsx
'use client';

import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Falha no Pagamento
          </h1>
          <p className="text-xl text-gray-600">
            Não foi possível processar seu pagamento
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="space-y-6">
            {/* Common Reasons */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Possíveis Motivos</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cartão sem limite disponível</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dados do cartão incorretos</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cartão vencido ou bloqueado</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Problema temporário com o processador de pagamentos</span>
                </li>
              </ul>
            </div>

            {/* What to do */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">O que fazer agora?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-medium text-blue-600">1.</span>
                  <span>Verifique os dados do seu cartão</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-blue-600">2.</span>
                  <span>Confirme se há limite disponível</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-blue-600">3.</span>
                  <span>Tente usar outro método de pagamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-blue-600">4.</span>
                  <span>Entre em contato com seu banco se necessário</span>
                </li>
              </ul>
            </div>

            {/* Error Code */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Código do erro</span>
                <span className="font-mono text-gray-900">#ERR-PAY-2025-XXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/pricing"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </Link>

          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 transition font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Painel
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 transition font-medium"
            >
              <HelpCircle className="w-5 h-5" />
              Preciso de Ajuda
            </Link>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Métodos de Pagamento Alternativos</h3>
          <p className="text-gray-600 mb-4">
            Aceita mos diversos métodos de pagamento:
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">💳 Cartão de Crédito</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">💰 PIX</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">📄 Boleto</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-2">
            Ainda com problemas? Nossa equipe está pronta para ajudar!
          </p>
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
            Falar com Suporte →
          </Link>
        </div>
      </div>
    </div>
  );
}
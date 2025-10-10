// app/payment/success/page.tsx
'use client';

import { CheckCircle, ArrowRight, Download, Mail } from 'lucide-react';
import Link from 'next/link'; // (não 'link')
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Sua assinatura foi ativada com sucesso
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="space-y-6">
            {/* Order Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Plano</span>
                  <span className="font-medium text-gray-900">Pro</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Valor</span>
                  <span className="font-medium text-gray-900">R$ 97,00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Período</span>
                  <span className="font-medium text-gray-900">Mensal</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Próxima cobrança</span>
                  <span className="font-medium text-gray-900">07/11/2025</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">ID da Transação</span>
                  <span className="font-mono text-sm text-gray-900">#PAY-2025-10-07-XXX</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">O que acontece agora?</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Você receberá um email de confirmação em instantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Seu acesso completo já está liberado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Explore todos os recursos premium agora</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
          >
            Ir para o Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 transition font-medium">
              <Download className="w-5 h-5" />
              Baixar Recibo
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 transition font-medium">
              <Mail className="w-5 h-5" />
              Reenviar Email
            </button>
          </div>
        </div>

        {/* Auto Redirect Notice */}
        {countdown > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Você será redirecionado automaticamente em {countdown} segundos...
            </p>
          </div>
        )}

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">
            Precisa de ajuda? Entre em contato com nosso suporte
          </p>
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
            Falar com Suporte
          </Link>
        </div>
      </div>
    </div>
  );
}
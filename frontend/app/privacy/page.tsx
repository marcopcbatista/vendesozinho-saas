// app/privacy/page.tsx
import { Shield, Calendar, Lock, Eye, Database, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: 07 de Outubro de 2025</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Navegação Rápida</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <a href="#coleta" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
              <Database className="w-4 h-4" />
              Coleta de Dados
            </a>
            <a href="#uso" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
              <Eye className="w-4 h-4" />
              Uso dos Dados
            </a>
            <a href="#seguranca" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
              <Lock className="w-4 h-4" />
              Segurança
            </a>
            <a href="#direitos" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
              <UserCheck className="w-4 h-4" />
              Seus Direitos
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O VendeSozinho ("nós", "nosso" ou "nos") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso serviço.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ao usar o VendeSozinho, você concorda com a coleta e uso de informações de acordo com esta política. Recomendamos que você leia esta política cuidadosamente.
            </p>
          </section>

          <section id="coleta" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1. Informações Fornecidas por Você</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Coletamos informações que você nos fornece diretamente, incluindo:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Informações de Conta:</strong> Nome, email, senha, telefone</li>
              <li><strong>Informações de Pagamento:</strong> Dados de cartão de crédito (processados de forma segura por nossos parceiros)</li>
              <li><strong>Informações de Perfil:</strong> Foto, empresa, cargo</li>
              <li><strong>Conteúdo:</strong> Mensagens, templates, leads e outros dados criados no serviço</li>
              <li><strong>Comunicações:</strong> Emails, tickets de suporte, feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2. Informações Coletadas Automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de uso, cliques, ações realizadas</li>
              <li><strong>Dados do Dispositivo:</strong> Tipo de dispositivo, sistema operacional, navegador, endereço IP</li>
              <li><strong>Cookies:</strong> Usamos cookies e tecnologias similares para melhorar sua experiência</li>
              <li><strong>Dados de Localização:</strong> Localização aproximada baseada no endereço IP</li>
            </ul>
          </section>

          <section id="uso" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Fornecer, operar e manter nosso Serviço</li>
              <li>Processar transações e enviar confirmações</li>
              <li>Personalizar sua experiência no Serviço</li>
              <li>Melhorar e desenvolver novos recursos</li>
              <li>Comunicar atualizações, ofertas e informações sobre o Serviço</li>
              <li>Fornecer suporte ao cliente</li>
              <li>Detectar e prevenir fraudes e abusos</li>
              <li>Analisar tendências e uso do Serviço</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar suas informações nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Provedores de Serviço:</strong> Com empresas que nos auxiliam (processamento de pagamentos, hospedagem, análise)</li>
              <li><strong>Parceiros de Negócios:</strong> Com seu consentimento explícito</li>
              <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou para proteger direitos</li>
              <li><strong>Transações Comerciais:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Todos os terceiros com quem compartilhamos dados são obrigados contratualmente a proteger suas informações.
            </p>
          </section>

          <section id="seguranca" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Criptografia SSL/TLS para transmissão de dados</li>
              <li>Criptografia de dados em repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e redundância</li>
              <li>Auditorias de segurança periódicas</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Embora nos esforcemos para proteger suas informações, nenhum método de transmissão pela Internet é 100% seguro. Você é responsável por manter a confidencialidade de sua senha.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos suas informações pelo tempo necessário para fornecer o Serviço e cumprir nossas obrigações legais. Quando você cancela sua conta, excluímos ou anonimizamos suas informações dentro de 90 dias, exceto quando a retenção for necessária por lei.
            </p>
          </section>

          <section id="direitos" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Acesso:</strong> Solicitar cópias de suas informações pessoais</li>
              <li><strong>Retificação:</strong> Corrigir informações imprecisas ou incompletas</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações</li>
              <li><strong>Portabilidade:</strong> Receber suas informações em formato estruturado</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de suas informações</li>
              <li><strong>Revogação:</strong> Revogar consentimento previamente dado</li>
              <li><strong>Informação:</strong> Saber quem tem acesso aos seus dados</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato através de: <strong>privacidade@vendesozinho.com</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies e Tecnologias de Rastreamento</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Manter você conectado ao Serviço</li>
              <li>Lembrar suas preferências</li>
              <li>Analisar uso e desempenho</li>
              <li>Fornecer conteúdo personalizado</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Você pode controlar cookies através das configurações do seu navegador. Note que desabilitar cookies pode afetar a funcionalidade do Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferências Internacionais</h2>
            <p className="text-gray-700 leading-relaxed">
              Seus dados podem ser transferidos e mantidos em servidores localizados fora do seu país de residência. Tomamos medidas para garantir que seus dados recebam proteção adequada de acordo com a LGPD.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacidade de Menores</h2>
            <p className="text-gray-700 leading-relaxed">
              Nosso Serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se descobrirmos que coletamos dados de um menor, tomaremos medidas para excluir essas informações.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas por email ou através de um aviso no Serviço. Recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, entre em contato:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Encarregado de Dados (DPO):</strong></p>
              <p className="text-gray-700"><strong>Email:</strong> privacidade@vendesozinho.com</p>
              <p className="text-gray-700"><strong>Email Geral:</strong> suporte@vendesozinho.com</p>
              <p className="text-gray-700"><strong>Telefone:</strong> (11) 9999-9999</p>
              <p className="text-gray-700"><strong>Endereço:</strong> São Paulo, SP, Brasil</p>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
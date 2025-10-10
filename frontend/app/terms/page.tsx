// app/terms/page.tsx
import { FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Termos de Serviço</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: 07 de Outubro de 2025</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Ao acessar e usar o VendeSozinho ("Serviço"), você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com alguma parte destes termos, não deverá usar nosso Serviço.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos de Serviço aplicam-se a todos os usuários do Serviço, incluindo, sem limitação, usuários que são navegadores, fornecedores, clientes, comerciantes e/ou colaboradores de conteúdo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O VendeSozinho é uma plataforma SaaS que oferece:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Geração de conteúdo de vendas utilizando inteligência artificial</li>
              <li>Integração com WhatsApp para envio de mensagens automatizadas</li>
              <li>Gestão e qualificação de leads</li>
              <li>Templates personalizáveis para campanhas de marketing</li>
              <li>Ferramentas de análise e relatórios</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registro e Conta de Usuário</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para utilizar nosso Serviço, você deve:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Fornecer informações precisas, atuais e completas durante o processo de registro</li>
              <li>Manter a segurança de sua senha e aceitar toda a responsabilidade por atividades que ocorram sob sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
              <li>Ter pelo menos 18 anos de idade ou a maioridade legal em sua jurisdição</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de suspender ou encerrar sua conta se qualquer informação fornecida durante o processo de registro ou posteriormente se mostrar imprecisa, não atual ou incompleta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Planos e Pagamentos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.1. Planos de Assinatura:</strong> Oferecemos diferentes planos de assinatura com recursos variados. Os detalhes de cada plano estão disponíveis em nossa página de preços.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.2. Faturamento:</strong> As cobranças são processadas mensalmente ou anualmente, dependendo do plano escolhido. Você autoriza o débito automático no método de pagamento fornecido.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>4.3. Reembolsos:</strong> Oferecemos garantia de reembolso de 7 dias para novos clientes. Após este período, não há reembolsos para períodos de assinatura já pagos.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>4.4. Alterações de Preço:</strong> Reservamo-nos o direito de alterar os preços mediante aviso prévio de 30 dias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Uso Aceitável</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você concorda em NÃO usar o Serviço para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Enviar spam ou mensagens não solicitadas em massa</li>
              <li>Violar quaisquer leis ou regulamentos locais, estaduais, nacionais ou internacionais</li>
              <li>Infringir direitos de propriedade intelectual de terceiros</li>
              <li>Transmitir vírus, malware ou qualquer código de natureza destrutiva</li>
              <li>Fazer engenharia reversa ou tentar obter o código-fonte do Serviço</li>
              <li>Usar o Serviço para fins ilegais ou não autorizados</li>
              <li>Assediar, ameaçar ou prejudicar outros usuários</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O Serviço e todo o seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do VendeSozinho e seus licenciadores. O Serviço é protegido por direitos autorais, marcas registradas e outras leis.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Você mantém todos os direitos sobre o conteúdo que criar usando o Serviço. No entanto, concede-nos uma licença para armazenar, processar e exibir esse conteúdo conforme necessário para fornecer o Serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Em nenhuma circunstância o VendeSozinho, seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Rescisão</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você pode cancelar sua assinatura a qualquer momento através das configurações de sua conta. O cancelamento entrará em vigor no final do período de faturamento atual.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de suspender ou encerrar seu acesso ao Serviço imediatamente, sem aviso prévio, por violação destes Termos ou por qualquer outro motivo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos os usuários sobre alterações significativas por email ou através de um aviso em nosso Serviço. O uso continuado do Serviço após tais modificações constitui sua aceitação dos novos Termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar suas disposições sobre conflito de leis. Você concorda em se submeter à jurisdição exclusiva dos tribunais localizados no Brasil para resolver qualquer disputa legal.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> suporte@vendesozinho.com</p>
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
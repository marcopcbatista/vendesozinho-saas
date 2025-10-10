// app/about/page.tsx
import { Target, Users, Zap, Heart, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Foco no Cliente',
      description: 'Colocamos as necessidades dos nossos clientes em primeiro lugar em tudo que fazemos.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Zap,
      title: 'Inovação',
      description: 'Buscamos constantemente novas formas de melhorar e inovar nossos produtos.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Heart,
      title: 'Paixão',
      description: 'Somos apaixonados por ajudar empresas a crescerem e alcançarem seus objetivos.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Acreditamos no poder da colaboração e trabalho em equipe.',
      color: 'bg-green-100 text-green-600'
    },
  ];

  const stats = [
    { value: '10k+', label: 'Usuários Ativos' },
    { value: '1M+', label: 'Mensagens Enviadas' },
    { value: '95%', label: 'Taxa de Satisfação' },
    { value: '24/7', label: 'Suporte' },
  ];

  const team = [
    {
      name: 'João Silva',
      role: 'CEO & Fundador',
      image: '👨‍💼'
    },
    {
      name: 'Maria Santos',
      role: 'CTO',
      image: '👩‍💻'
    },
    {
      name: 'Pedro Costa',
      role: 'Head de Produto',
      image: '👨‍🚀'
    },
    {
      name: 'Ana Oliveira',
      role: 'Head de Marketing',
      image: '👩‍🎨'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Sobre o VendeSozinho</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Revolucionando a forma como empresas se conectam com seus clientes através de inteligência artificial e automação inteligente.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 -mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                O VendeSozinho nasceu em 2023 com uma missão clara: democratizar o acesso a ferramentas de vendas avançadas para empresas de todos os tamanhos. Percebemos que muitas empresas lutavam para gerenciar suas vendas e se comunicar efetivamente com leads, especialmente em um mundo cada vez mais digital.
              </p>
              <p className="text-lg leading-relaxed">
                Combinando inteligência artificial de ponta com a simplicidade do WhatsApp, criamos uma plataforma que permite que qualquer pessoa, independentemente de seu conhecimento técnico, possa automatizar e escalar suas vendas de forma inteligente.
              </p>
              <p className="text-lg leading-relaxed">
                Hoje, milhares de empresas confiam no VendeSozinho para gerenciar seus leads, criar conteúdo de vendas persuasivo e se conectar com seus clientes de forma mais eficiente. E estamos apenas começando.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
              <p className="text-gray-700 leading-relaxed">
                Empoderar empresas de todos os tamanhos com ferramentas de automação de vendas baseadas em IA, permitindo que elas cresçam de forma eficiente e sustentável, enquanto mantêm um relacionamento próximo e personalizado com seus clientes.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
              <p className="text-gray-700 leading-relaxed">
                Ser a plataforma líder em automação de vendas com IA na América Latina, reconhecida pela excelência em inovação, facilidade de uso e resultados comprovados para nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-gray-600">Os princípios que guiam tudo o que fazemos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conheça Nosso Time</h2>
            <p className="text-xl text-gray-600">As pessoas por trás do VendeSozinho</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Reconhecimento</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Orgulhosamente reconhecidos como uma das startups mais promissoras de tecnologia em 2024
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold">🏆</div>
                <p className="mt-2">Melhor Startup SaaS 2024</p>
              </div>
              <div>
                <div className="text-2xl font-bold">⭐</div>
                <p className="mt-2">Top 10 em Inovação</p>
              </div>
              <div>
                <div className="text-2xl font-bold">🚀</div>
                <p className="mt-2">Crescimento Mais Rápido</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Pronto para Fazer Parte da Nossa História?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de empresas que já transformaram suas vendas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Começar Gratuitamente
            </Link>
            <Link
              href="/contact"
              className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition font-semibold text-lg"
            >
              Falar com a Equipe
            </Link>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="py-8 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
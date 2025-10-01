<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vendeSozinho - Crie Textos de Vendas com IA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .gradient-bg {
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }
        .pulse-soft {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen text-white">
    
    <!-- Header -->
    <header class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-xl">
                    V
                </div>
                <div>
                    <h1 class="text-2xl font-bold">vendeSozinho</h1>
                    <span class="text-xs text-purple-300">Beta v1.0</span>
                </div>
            </div>
            <div class="hidden md:flex gap-4 text-sm">
                <span class="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">✨ Grátis</span>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-12 text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Crie Textos de Vendas com IA
        </h2>
        <p class="text-xl text-gray-300 mb-8">
            Descreva seu produto e deixe a IA criar o texto perfeito para você
        </p>
    </section>

    <!-- Main Generator Section -->
    <section class="container mx-auto px-4 pb-20">
        <div class="max-w-4xl mx-auto">
            
            <!-- Step 1: Input -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 shadow-2xl">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">1</div>
                    <h3 class="text-xl font-semibold">Descreva o que você quer vender</h3>
                </div>
                <textarea 
                    id="productInput"
                    placeholder="Ex: Um curso online de marketing digital que ensina estratégias práticas para vender mais nas redes sociais..."
                    class="w-full h-32 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                ></textarea>
            </div>

            <!-- Step 2: Content Type -->
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 shadow-2xl">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">2</div>
                    <h3 class="text-xl font-semibold">Escolha o tipo de conteúdo</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onclick="selectType('email')" id="btn-email" class="content-type-btn bg-purple-600 hover:bg-purple-700 p-6 rounded-xl transition-all transform hover:scale-105 border-2 border-purple-400">
                        <div class="text-3xl mb-2">📧</div>
                        <div class="font-semibold">Email de Vendas</div>
                    </button>
                    <button onclick="selectType('landing')" id="btn-landing" class="content-type-btn bg-white/5 hover:bg-white/10 p-6 rounded-xl transition-all transform hover:scale-105 border-2 border-transparent">
                        <div class="text-3xl mb-2">🌐</div>
                        <div class="font-semibold">Landing Page</div>
                    </button>
                    <button onclick="selectType('ad')" id="btn-ad" class="content-type-btn bg-white/5 hover:bg-white/10 p-6 rounded-xl transition-all transform hover:scale-105 border-2 border-transparent">
                        <div class="text-3xl mb-2">📢</div>
                        <div class="font-semibold">Anúncio</div>
                    </button>
                </div>
            </div>

            <!-- Generate Button -->
            <div class="text-center mb-6">
                <button 
                    onclick="generateText()"
                    id="generateBtn"
                    class="gradient-bg text-white px-12 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ✨ Gerar Texto de Vendas
                </button>
            </div>

            <!-- Step 3: Result -->
            <div id="resultSection" class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hidden">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">3</div>
                        <h3 class="text-xl font-semibold">Seu texto de vendas</h3>
                    </div>
                    <button onclick="copyText()" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                        📋 Copiar
                    </button>
                </div>
                <div id="loadingSpinner" class="text-center py-12 hidden">
                    <div class="inline-block w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <p class="mt-4 text-gray-300">Gerando seu texto perfeito...</p>
                </div>
                <div id="resultText" class="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-200 leading-relaxed whitespace-pre-wrap">
                    Seu texto aparecerá aqui após a geração
                </div>
            </div>

        </div>
    </section>

    <!-- Stats Section -->
    <section class="container mx-auto px-4 py-12">
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div class="text-4xl font-bold text-purple-400 mb-2">1000+</div>
                <div class="text-gray-300">Textos Gerados</div>
            </div>
            <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div class="text-4xl font-bold text-purple-400 mb-2">98%</div>
                <div class="text-gray-300">Taxa de Satisfação</div>
            </div>
            <div class="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <div class="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div class="text-gray-300">Disponibilidade</div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-white/10">
        <p>© 2025 vendeSozinho SaaS. Todos os direitos reservados.</p>
    </footer>

    <script>
        let selectedType = 'email';

        function selectType(type) {
            selectedType = type;
            
            // Reset all buttons
            document.querySelectorAll('.content-type-btn').forEach(btn => {
                btn.classList.remove('bg-purple-600', 'border-purple-400');
                btn.classList.add('bg-white/5', 'border-transparent');
            });
            
            // Highlight selected
            const selectedBtn = document.getElementById(`btn-${type}`);
            selectedBtn.classList.remove('bg-white/5', 'border-transparent');
            selectedBtn.classList.add('bg-purple-600', 'border-purple-400');
        }

        async function generateText() {
            const input = document.getElementById('productInput').value.trim();
            
            if (!input) {
                alert('Por favor, descreva o produto que você quer vender!');
                return;
            }

            const resultSection = document.getElementById('resultSection');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const resultText = document.getElementById('resultText');
            
            // Show result section and loading
            resultSection.classList.remove('hidden');
            resultSection.classList.add('fade-in');
            loadingSpinner.classList.remove('hidden');
            resultText.classList.add('hidden');
            
            // Scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Simulate API call (replace with real API)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate text based on type
            const generatedText = generateSalesText(input, selectedType);
            
            // Show result
            loadingSpinner.classList.add('hidden');
            resultText.classList.remove('hidden');
            resultText.textContent = generatedText;
        }

        function generateSalesText(product, type) {
            const templates = {
                email: `🎯 Assunto: Descubra Como Transformar Seus Resultados Hoje!

Olá!

Você já imaginou ${product.toLowerCase()}?

A verdade é que muitas pessoas ainda não descobriram o potencial incrível que existe em ter acesso a essa solução.

✨ Por que isso é importante para você?

• Resultados comprovados e mensuráveis
• Processo simples e direto
• Suporte completo durante toda jornada

🚀 Não perca essa oportunidade!

Milhares de pessoas já estão aproveitando essas vantagens. E você? Está pronto para ser o próximo caso de sucesso?

[CLIQUE AQUI PARA COMEÇAR AGORA]

Um abraço,
Equipe vendeSozinho

P.S.: Vagas limitadas! Garanta a sua agora.`,

                landing: `🚀 TRANSFORME SEUS RESULTADOS HOJE!

${product}

━━━━━━━━━━━━━━━━━━━━━━

✨ POR QUE ESCOLHER NOSSA SOLUÇÃO?

✅ Resultados Comprovados
Mais de 1.000 clientes satisfeitos com resultados reais e mensuráveis.

✅ Processo Simplificado
Método passo a passo que qualquer pessoa pode seguir, mesmo sem experiência.

✅ Suporte Dedicado
Nossa equipe está sempre disponível para ajudar você a ter sucesso.

━━━━━━━━━━━━━━━━━━━━━━

🎁 OFERTA ESPECIAL

Por tempo limitado, você terá acesso a:
• Bônus exclusivos no valor de R$ 497
• Garantia de 30 dias (sem perguntas)
• Atualizações gratuitas vitalícias

━━━━━━━━━━━━━━━━━━━━━━

⏰ VAGAS LIMITADAS!

Não deixe essa oportunidade passar. Junte-se aos milhares de pessoas que já estão transformando seus resultados.

[QUERO COMEÇAR AGORA] 👈

💯 Satisfação Garantida ou Seu Dinheiro de Volta`,

                ad: `🔥 ATENÇÃO: Oferta Por Tempo Limitado!

${product}

✨ Imagine ter acesso a uma solução que já transformou a vida de mais de 1.000 pessoas...

🎯 VOCÊ VAI CONQUISTAR:
→ Resultados rápidos e consistentes
→ Método comprovado e testado
→ Suporte completo incluso

⚡ BÔNUS EXCLUSIVOS (Valor: R$ 497)
🎁 Acesso imediato
🎁 Garantia de 30 dias
🎁 Comunidade VIP

💰 De R$ 497 por apenas R$ 97
⏰ Últimas vagas disponíveis!

[CLIQUE AQUI E GARANTA SUA VAGA] 👈

✅ +1.000 alunos satisfeitos
✅ 98% de aprovação
✅ Resultados em 7 dias

Não perca! Esta oferta expira em breve.`
            };

            return templates[type] || templates.email;
        }

        function copyText() {
            const text = document.getElementById('resultText').textContent;
            navigator.clipboard.writeText(text).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ Copiado!';
                btn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('bg-green-600');
                }, 2000);
            });
        }

        // Initialize
        selectType('email');
    </script>

</body>
</html>
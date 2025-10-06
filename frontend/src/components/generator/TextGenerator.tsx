'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [textType, setTextType] = useState('sales_copy');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: textType }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedText(data.generated_text);
      }
    } catch (error) {
      console.error('Erro ao gerar texto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const textTypes = [
    { value: 'sales_copy', label: 'Copy de Vendas' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'social_media', label: 'Redes Sociais' },
    { value: 'landing_page', label: 'Landing Page' },
    { value: 'product_description', label: 'Descrição de Produto' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Textos de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Texto</label>
              <select value={textType} onChange={(e) => setTextType(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {textTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descreva seu produto/serviço</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ex: Curso online de marketing digital..." className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {isLoading ? 'Gerando...' : 'Gerar Texto de Vendas'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Texto Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{generatedText}</pre>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedText)}>Copiar</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


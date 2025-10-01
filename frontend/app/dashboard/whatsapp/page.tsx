"use client";

import { useState } from "react";

export default function WhatsAppPage() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Erro ao enviar mensagem" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Enviar mensagem no WhatsApp</h1>

      <input
        type="text"
        placeholder="Número do WhatsApp (ex: +5511999999999)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2 rounded w-96"
      />

      <textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 rounded w-96 h-32"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>

      {response && (
        <div className="mt-4 p-3 border rounded w-96 bg-gray-50">
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

import "./globals.css";
import React from "react";

// ✅ Fonte local ou padrão do sistema — nada de next/font/google
const inter = { className: "font-sans" };

export const metadata = {
  title: "vendeSozinho",
  description: "Gere textos de vendas com IA — versão offline",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* 💡 Caso queira usar Inter local, descomente abaixo:
        <link rel="stylesheet" href="/fonts/inter/inter.css" />
        */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}

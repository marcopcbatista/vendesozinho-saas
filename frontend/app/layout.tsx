import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "./providers"; // importa o contexto corrigido

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "vendeSozinho",
  description: "Gerador de textos de vendas com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

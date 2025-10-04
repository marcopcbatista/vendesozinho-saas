import { NextResponse } from "next/server";


export async function POST(req: Request) {
try {
const body = await req.json();
console.log("📩 Webhook recebido:", body);


// Exemplo: salvar no banco ou disparar automação
return NextResponse.json({ received: true });
} catch (error) {
console.error("Erro no webhook:", error);
return NextResponse.json({ error: "Erro interno" }, { status: 500 });
}
}

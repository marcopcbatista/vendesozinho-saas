import { NextResponse } from 'next/server';

// Webhook para receber mensagens do WhatsApp
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Webhook recebido:', body);

    // Exemplo: salvar no banco ou disparar automacao
    // await saveWebhookData(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro ao processar webhook' }, { status: 500 });
  }
}

// Verificacao do webhook (Meta/WhatsApp)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'seu_token_secreto';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado com sucesso');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verificacao falhou' }, { status: 403 });
}

import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { items, successUrl, cancelUrl } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}


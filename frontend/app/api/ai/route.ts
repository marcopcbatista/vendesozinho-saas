import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    })

    return NextResponse.json({ reply: response.choices[0].message.content })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

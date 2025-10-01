import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const { data, error } = await supabase.from('leads').select('*')
    if (error) throw error

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, error } = await supabase.from('leads').insert(body).select()
    if (error) throw error

    return NextResponse.json(data[0])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

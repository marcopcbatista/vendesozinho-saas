import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('leads').select('*')
    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from('leads').insert([body]).select()
    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}


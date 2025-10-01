// lib/leads.ts
import { supabase } from './supabase-client'

export async function saveLead(email: string) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{ email }])

  if (error) throw new Error(error.message)
  return data
}

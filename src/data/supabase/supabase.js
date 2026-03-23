import { createClient } from '@supabase/supabase-js'

// Next.js mein hum 'process.env' use karte hain
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
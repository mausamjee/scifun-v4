import { createClient } from '@supabase/supabase-js'

// Next.js mein hum 'process.env' use karte hain
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
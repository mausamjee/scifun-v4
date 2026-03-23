import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Supabase Configuration
// Note: NEXT_PUBLIC_ is required for client-side access in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Gemini AI Configuration
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Fallback logic to prevent build crash if key is missing
const genAI = new GoogleGenerativeAI(GEMINI_KEY || 'placeholder');
export const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at startup instead of quietly breaking every query later.
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.'
  )
}

// One client, imported everywhere. The anon key is safe to ship to the
// browser ONLY because RLS policies (see sql/schema.sql) enforce who can
// read/write which rows. Without RLS, this key would let anyone read or
// write every row in every table.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

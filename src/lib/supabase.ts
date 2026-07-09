import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // PKCE keeps OAuth tokens out of the URL; detectSessionInUrl (default true)
  // exchanges the ?code= param on load, so no dedicated callback route is needed.
  auth: { flowType: 'pkce' },
})

import { createBrowserClient } from '@supabase/ssr'
import { env } from '~/env'

export function supabase() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}


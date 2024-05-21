import { redirect } from 'next/navigation'

import { supabaseServerClient } from '~/supabase/server'

export default async function PrivatePage() {
  const supabase = supabaseServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error ?? !data.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}

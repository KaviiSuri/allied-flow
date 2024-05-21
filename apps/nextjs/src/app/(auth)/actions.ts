'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { supabaseServerClient } from '~/supabase/server'

export async function login(formData: FormData) {
  const supabase = supabaseServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = supabaseServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = supabaseServerClient()

  const origin = headers().get("origin")
  const redirectUrl = new URL(origin + `/auth/callback`);
  const res = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString(),
    },
  })
  if (res.data.url) redirect(res.data.url);
  throw res.error
}

export const signOut = async () => {
  const supabase = supabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
};

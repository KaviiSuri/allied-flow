'use client'
import { api } from '~/trpc/react'

export default function PrivatePage() {
  const { data, isLoading, error } = api.auth.getSession.useQuery()

  if (isLoading) {
    return "Loading..."
  }

  if (error ?? !data?.user) {
    return <p>{error?.message ?? "not found user"}</p>
  }
  return <p>Hello, from TRPC {data.user.email}</p>
}

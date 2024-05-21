'use client'
import { Button } from '@repo/ui/button'
import { signInWithGoogle } from '../actions'
import { useUser } from '~/providers/AuthProvider/AuthProvider'
import { redirect } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const { user, isLoading } = useUser();
  if (user) {
    redirect('/');
  }
  return (
    <div className="container h-screen flex flex-col items-center justify-center gap-4">
      {isLoading ? (
        <LoadingSkeleton />
      ) :
        <LoginForm />
      }
    </div >
  )
}

function LoginForm() {
  return (
    <div className="w-64 h-60 rounded-xl border-zinc-800 border flex flex-col items-center justify-start gap-4 pt-8">
      <h1>Welcome!</h1>
      <Button
        onClick={() => signInWithGoogle()}
        variant="outline"
        className='gap-2'
      >
        <FaGoogle />
        Login With Google
      </Button>
      OR
      <Button
        onClick={() => signInWithGoogle()}
        variant="outline"
        className='gap-2'
      >
        <FaGoogle />
        Login With Google
      </Button>
    </div>
  )
}

function LoadingSkeleton() {
  return <div className='w-64 h-60 rounded-xl bg-zinc-900 border-zinc-800 border animate-pulse'>
  </div>
}

import { useEffect, useState } from 'react'
import { supabase } from '~/lib/supabaseClient';

export default function AuthToggleButton() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription?.subscription?.unsubscribe()
  }, [])

  const handleLogin = async () => {
    // await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/account/dashboard`
    //   }
    // })
     window.location.href = '/auth/signin'; // Redirect to login page
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Redirect to home after logout
    window.location.href = `${window.location.origin}`;
  }

  return (
    <button
      onClick={user ? handleLogout : handleLogin}
      className="ml-2 py-2.5 font-semibold text-sm text-black rounded dark:text-white"
    >
      {user ? 'Sign out' : 'Sign in'}
    </button>
  )
}

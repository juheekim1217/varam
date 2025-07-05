import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function UserInfo() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    user ?
        <div><p>You're logged in as:</p>
    <p className="text-gray-700 mt-2">
      {user.user_metadata?.full_name || user.email} <br/>
    </p></div>
    : <p>You are not signed in.</p>
  )
}

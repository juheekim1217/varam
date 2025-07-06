// src/components/auth/ShowIfGuest.jsx
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

// This component conditionally renders its children only if the user is not logged in.
export default function ShowIfGuest({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  if (user) return null; // Hide children if logged in

  return children;
}

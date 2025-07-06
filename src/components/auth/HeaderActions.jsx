// src/components/auth/HeaderActions.jsx
import { useEffect, useState } from 'react';
import { supabase } from '~/lib/supabaseClient';
import Button from '~/components/ui/Button.astro';

export default function HeaderActions({ actions }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  if (user) return null; // 🔒 hide actions when logged in

  return (
    <span className="ml-4 rtl:ml-0 rtl:mr-4">
      {actions.map((action) =>
        action.variant === 'link' ? (
          <a
            title={action.text}
            href={action.href}
            target={action.target}
            className="ml-2 text-sm font-medium text-gray-700 hover:underline"
          >
            {action.text}
          </a>
        ) : (
          <Button {...action} className="ml-2 py-2.5 px-5.5 md:px-6 font-semibold shadow-none text-sm w-auto" />
        )
      )}
    </span>
  );
}

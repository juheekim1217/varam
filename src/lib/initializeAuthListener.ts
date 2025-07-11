// src/lib/initializeAuthListener.ts
import { supabase } from '~/lib/supabaseClient';
import { user, loading, error } from '~/stores/userStore';

export const initializeAuthListener = () => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      loading.set(true);
      error.set('');
      try {
        const currentUser = session.user;

        const { data: userRow, error: userFetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (userFetchError) console.warn('Could not fetch user role:', userFetchError.message);

        const userData = {
          id: currentUser.id,
          email: currentUser.email,
          fullName: currentUser.user_metadata?.full_name || currentUser?.email?.split('@')[0],
          role: userRow?.role || null,
        };

        user.set(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        user.set(null);
        error.set('Failed to fetch user: ' + err.message);
      } finally {
        loading.set(false);
      }
    }

    if (event === 'SIGNED_OUT') {
      user.set(null);
      localStorage.removeItem('user');
    }
  });

  // Try to restore cached user if exists
  const cached = localStorage.getItem('user');
  if (cached) {
    try {
      user.set(JSON.parse(cached));
    } catch {
      localStorage.removeItem('user');
    }
  }
};

import { supabase } from '~/lib/supabaseClient';
import { user, loading, error } from '~/stores/authStore';
import type { UserData } from '~/stores/authStore';

export const initializeAuthListener = async () => {
  loading.set(true);

  // Try to restore cached user
  const cached = localStorage.getItem('user');
  if (cached) {
    try {
      const parsedUser: UserData = JSON.parse(cached);
      // Verify the cached user still exists in Supabase
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser && currentUser.id === parsedUser.id) {
        user.set(parsedUser);
      } else {
        localStorage.removeItem('user');
      }
    } catch {
      localStorage.removeItem('user');
    }
  }

  loading.set(false);

  // Listen to Supabase auth events
  return supabase.auth.onAuthStateChange(async (event, session) => {
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

        if (userFetchError) {
          console.warn('Could not fetch user role:', userFetchError.message);
        }

        const userData: UserData = {
          id: currentUser.id,
          email: currentUser.email,
          fullName: currentUser.user_metadata?.full_name ?? currentUser.email?.split('@')[0] ?? '',
          role: userRow?.role || null,
        };

        user.set(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        user.set(null);
        error.set('Failed to fetch user: ' + (err as Error).message);
      } finally {
        loading.set(false);
      }
    }

    if (event === 'SIGNED_OUT') {
      user.set(null);
      localStorage.removeItem('user');
    }
  });
};

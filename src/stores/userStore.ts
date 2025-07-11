import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Define interfaces for type safety
export interface UserData {
  id: string;
  email: string | undefined;
  fullName: string;
  role: string | null;
}

interface UserRow {
  role: string | null;
}

// Typed atoms
export const user = atom<UserData | null>(null);
export const loading = atom<boolean>(false);
export const error = atom<string>('');

// Fetch user and role from Supabase with type safety
export const fetchUser = async (): Promise<void> => {
  try {
    loading.set(true);
    error.set('');

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const currentUser: User | undefined = sessionData?.session?.user;

    if (sessionError || !currentUser) {
      user.set(null);
      error.set('Please sign in.');
      return;
    }

    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle<UserRow>();

    if (userFetchError) {
      console.warn('Could not fetch user role:', userFetchError.message);
    }

    const userData: UserData = {
      id: currentUser.id,
      email: currentUser.email,
      fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '',
      role: userRow?.role || null,
    };

    user.set(userData);
  } catch (err) {
    error.set(`Failed to fetch user: ${(err as Error).message}`);
    user.set(null);
  } finally {
    loading.set(false);
  }
};

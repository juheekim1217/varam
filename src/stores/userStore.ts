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

// Add this interface for sign-in response
interface SignInResponse {
  success: boolean;
  error?: string;
  data?: UserData;
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

// Add the signIn function after fetchUser
export async function signIn(email: string, password: string): Promise<SignInResponse> {
  try {
    loading.set(true);
    error.set('');

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      error.set(signInError.message);
      return { success: false, error: signInError.message };
    }

    if (!authData?.user) {
      error.set('No user data returned');
      return { success: false, error: 'No user data returned' };
    }

    // Fetch user role from database
    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle<UserRow>();

    if (userFetchError) {
      console.warn('Could not fetch user role:', userFetchError.message);
    }

    const userData: UserData = {
      id: authData.user.id,
      email: authData.user.email,
      fullName: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || '',
      role: userRow?.role || null,
    };

    user.set(userData);
    return { success: true, data: userData };
  } catch (err) {
    const message = (err as Error).message;
    error.set(message);
    return { success: false, error: message };
  } finally {
    loading.set(false);
  }
}

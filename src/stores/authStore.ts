import { atom } from 'nanostores';
import { supabase } from '~/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Types
export interface UserData {
  id: string;
  email: string | undefined;
  fullName: string;
  role: string | null;
  phone: string | undefined;
}

interface UserRow {
  id: string;
  email: string | undefined;
  role: string | null;
  phone: string | undefined;
  full_name: string | undefined;
}

interface SignInResponse {
  success: boolean;
  error?: string;
  data?: UserData;
}

interface SignUpResponse {
  success: boolean;
  error?: string;
  data?: UserData;
}

interface PasswordResetResponse {
  success: boolean;
  error?: string;
}

// Atoms (global state)
export const user = atom<UserData | null>(null);
export const loading = atom<boolean>(false);
export const error = atom<string>('');

// Fetch user from Supabase session + user row
export const fetchUser = async (): Promise<UserData | null> => {
  try {
    loading.set(true);
    error.set('');

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const currentUser: User | undefined = sessionData?.session?.user;

    if (sessionError || !currentUser) {
      user.set(null);
      error.set('Please sign in.');
      return null;
    }

    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle<UserRow>();

    if (userFetchError) {
      console.warn('Could not fetch user role:', userFetchError.message);
    }

    const userData: UserData = {
      id: currentUser.id,
      email: currentUser.email,
      role: userRow?.role || null,
      phone: userRow?.phone || undefined,
      fullName: userRow?.full_name || currentUser.email?.split('@')[0] || '',
    };

    user.set(userData);
    return userData;
  } catch (err) {
    error.set(`Failed to fetch user: ${(err as Error).message}`);
    user.set(null);
    return null;
  } finally {
    loading.set(false);
  }
};

// Sign in with Supabase and set user
export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
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

    const userObj = authData.user;
    if (!userObj) {
      const msg = 'No user data returned.';
      error.set(msg);
      return { success: false, error: msg };
    }

    const { data: userRow, error: userFetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userObj.id)
      .maybeSingle<UserRow>();

    if (userFetchError) {
      console.warn('Could not fetch user role:', userFetchError.message);
    }

    const userData: UserData = {
      id: userObj.id,
      email: userObj.email,
      role: userRow?.role || null,
      phone: userRow?.phone || undefined,
      fullName: userRow?.full_name || userObj.email?.split('@')[0] || '',
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
};

export const signUp = async (email: string, password: string): Promise<SignUpResponse> => {
  try {
    loading.set(true);
    error.set('');

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      error.set(signUpError.message);
      return { success: false, error: signUpError.message };
    }

    if (!authData?.user) {
      const msg = 'No user data returned';
      error.set(msg);
      return { success: false, error: msg };
    }

    const userData: UserData = {
      id: authData.user.id,
      email: authData.user.email,
      fullName: authData.user.email?.split('@')[0] ?? '',
      role: 'guest',
      phone: undefined,
    };

    // Don't set user here since they need to verify email
    return { success: true, data: userData };
  } catch (err) {
    const message = (err as Error).message;
    error.set(message);
    return { success: false, error: message };
  } finally {
    loading.set(false);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } finally {
    user.set(null);
    error.set('');
  }
};

export const initAuthListener = () => {
  return supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_IN' && session?.user) {
      loading.set(true);
      error.set('');

      try {
        const currentUser = session.user;
        const { data: userRow, error: userFetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle<UserRow>();

        if (userFetchError) {
          console.warn('Could not fetch user role:', userFetchError.message);
        }

        const userData: UserData = {
          id: currentUser.id,
          email: currentUser.email,
          role: userRow?.role ?? null,
          phone: userRow?.phone ?? '',
          fullName: userRow?.full_name ?? currentUser.email?.split('@')[0] ?? '',
        };

        user.set(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        user.set(null);
        error.set(`Failed to fetch user: ${(err as Error).message}`);
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

export const resetPassword = async (password: string): Promise<PasswordResetResponse> => {
  try {
    loading.set(true);
    error.set('');

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      error.set(updateError.message);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    const message = (err as Error).message;
    error.set(message);
    return { success: false, error: message };
  } finally {
    loading.set(false);
  }
};

export const resetPasswordForEmail = async (email: string, redirectTo: string): Promise<PasswordResetResponse> => {
  try {
    loading.set(true);
    error.set('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      error.set(resetError.message);
      return { success: false, error: resetError.message };
    }

    return { success: true };
  } catch (err) {
    const message = (err as Error).message;
    error.set(message);
    return { success: false, error: message };
  } finally {
    loading.set(false);
  }
};

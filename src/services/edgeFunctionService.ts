interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

export const deleteUser = async (userId: string, email: string): Promise<DeleteUserResponse> => {
  try {
    const response = await fetch(import.meta.env.PUBLIC_SUPABASE_URL + '/functions/v1/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete account');
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete account',
    };
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(import.meta.env.PUBLIC_SUPABASE_URL + '/functions/v1/check-email-exists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('Failed to check email');

    const result = await res.json();
    return result.exists === true;
  } catch (err) {
    console.error('Error checking email:', err);
    return false;
  }
};

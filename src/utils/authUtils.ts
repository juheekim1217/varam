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

export const checkBlockedEmail = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(import.meta.env.PUBLIC_SUPABASE_URL + '/functions/v1/check-email-blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    return result.allowed === true;
  } catch (err) {
    console.error('Failed to check blocked email:', err);
    return true; // Default to allow if function fails
  }
};

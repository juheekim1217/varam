interface DeleteUserResponse {
  success: boolean;
  error?: string;
}

export interface CheckInquiryPayload {
  name: string;
  email: string;
  message: string;
}

export interface CheckTrialInquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

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

export async function checkContactInquiryBlocked({
  name,
  email,
  message,
}: CheckInquiryPayload): Promise<{ allowed: boolean }> {
  try {
    const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      throw new Error(`Supabase returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('checkInquiryBlocked error:', err);
    return { allowed: true }; // fallback to allow
  }
}

export async function checkTrialInquiryBlocked({
  firstName,
  lastName,
  email,
  phone,
  message,
}: CheckTrialInquiryPayload): Promise<{ allowed: boolean }> {
  try {
    const res = await fetch(`${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/check-inquiry-blocked`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, phone, message }),
    });
    if (!res.ok) {
      throw new Error(`Supabase returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('checkInquiryBlocked error:', err);
    return { allowed: true }; // fallback to allow
  }
}

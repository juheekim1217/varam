import { useState } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const checkEmailExists = async (email) => {
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
      return false; // or return null to distinguish errors
    }
  };

  const checkBlockedEmail = async (email) => {
    try {
      const res = await fetch(import.meta.env.PUBLIC_SUPABASE_URL + '/functions/v1/check-email-blocked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      return result.allowed == true;
    } catch (err) {
      console.error('Failed to check blocked email:', err);
      return true; // Default to allow if function fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Validate email from abuse and spam
    const allowed = await checkBlockedEmail(email);
    if (!allowed) {
      setErrorMsg('Sign-up denied. This email address is permanently blocked due to suspicious or abusive activity.');
      setLoading(false);
      return;
    }

    // Check if email is already registered
    const exists = await checkEmailExists(email);
    if (exists) {
      setErrorMsg('This email is already registered. Please sign in instead.');
      setLoading(false);
      return;
    }

    // Proceed with sign-up
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Account created! Please check your email to confirm your registration.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {successMsg && <p className="text-green-600">{successMsg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

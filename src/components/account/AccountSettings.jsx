import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const currentUserEmail = user.email;
      const response = await fetch(import.meta.env.PUBLIC_SUPABASE_URL + '/functions/v1/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, email: user.email }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to delete account');

      setMessage('Your account has been deleted.');

      // ⏳ Wait 5 seconds before signing out or redirecting
      //setTimeout(async () => {
      await supabase.auth.signOut();
      setUser(null);
      // Optionally redirect:
      window.location.href = `/messages/account-deleted?email=${encodeURIComponent(currentUserEmail)}`;
      //}, 500);

      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>You are not signed in.</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Signed in as <strong>{user.email}</strong>
      </p>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handleDeleteAccount}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Account'}
      </button>
    </div>
  );
}

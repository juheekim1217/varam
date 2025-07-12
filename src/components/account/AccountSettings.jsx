import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { user, signOut } from '~/stores/authStore';
import { deleteUser } from '~/services/edgeFunctionService';

export default function AccountSettings() {
  const $user = useStore(user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (!$user) return;

    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const currentUserEmail = $user.email;
      const result = await deleteUser($user.id, $user.email);

      if (!result.success) {
        throw new Error(result.error);
      }

      setMessage('Your account has been deleted.');
      await signOut();

      // Redirect to deletion confirmation page
      window.location.href = `/messages/account-deleted?email=${encodeURIComponent(currentUserEmail)}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!$user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Please sign in to access account settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Signed in as <strong>{$user.email}</strong>
      </p>

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-800 flex items-center justify-center"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Deleting...
          </>
        ) : (
          'Delete Account'
        )}
      </button>
    </div>
  );
}

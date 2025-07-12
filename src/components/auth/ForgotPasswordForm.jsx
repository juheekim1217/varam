import { useState } from 'react';
import { resetPasswordForEmail } from '~/stores/authStore';
import { checkEmailExists } from '~/utils/edgeFunctionService';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const exists = await checkEmailExists(email);
    if (!exists) {
      setError('No account found with this email.');
      setLoading(false);
      return;
    }

    const result = await resetPasswordForEmail(email, `${window.location.origin}/auth/reset-password`);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Password reset email sent! Please check your inbox.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none "
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {loading ? 'Sending...' : 'Send Reset Email'}
      </button>
    </form>
  );
}

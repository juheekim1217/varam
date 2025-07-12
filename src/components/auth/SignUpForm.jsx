import { useState } from 'react';
import { signUp } from '~/stores/authStore';
import { checkEmailExists, checkBlockedEmail } from '~/services/edgeFunctionService';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const [exists, allowed] = await Promise.all([checkEmailExists(email), checkBlockedEmail(email)]);

      if (exists) {
        setErrorMsg('This email is already registered. Please sign in instead.');
        return;
      }

      if (!allowed) {
        setErrorMsg('Sign-up denied. This email address is permanently blocked.');
        return;
      }

      // Proceed with sign-up
      const result = await signUp(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccessMsg('Account created! Please check your email to confirm your registration.');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
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
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none "
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
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none   "
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

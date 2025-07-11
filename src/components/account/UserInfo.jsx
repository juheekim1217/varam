import { useStore } from '@nanostores/react';
import { user } from '~/stores/authStore';

export default function UserInfo() {
  const $user = useStore(user);

  if (!$user) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">You are not signed in.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md">
      <div className="text-xs uppercase text-gray-400 tracking-wide mb-1">Logged in as</div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {$user.fullName || $user.email?.split('@')[0]}
        </div>
        <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full capitalize">
          {$user.role || 'member'}
        </span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{$user.email}</div>
    </div>
  );
}

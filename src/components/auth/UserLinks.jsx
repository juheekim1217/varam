import { useStore } from '@nanostores/react';
import { user as userStore } from '~/stores/authStore';

export default function UserLinks() {
  const user = useStore(userStore);

  if (!user) return null;

  const role = user.role;

  return (
    <li className="dropdown">
      <button
        type="button"
        className="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap"
      >
        My Account
        <svg
          className="w-3.5 h-3.5 ml-0.5 hidden md:inline"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <ul className="dropdown-menu md:backdrop-blur-md dark:md:bg-dark rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white/90 md:min-w-[200px] drop-shadow-xl">
        {(role === 'admin' || role === 'coach') && (
          <li>
            <a
              href="/account/dashboard"
              className="md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
            >
              Dashboard
            </a>
          </li>
        )}

        {role !== 'guest' && (
          <li>
            <a
              href="/account/book-session"
              className="first:rounded-t md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
            >
              Book Session
            </a>
          </li>
        )}

        <li>
          <a
            href="/account/my-bookings"
            className="md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
          >
            My Bookings
          </a>
        </li>

        <li>
          <a
            href="/account/account-settings"
            className="last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap"
          >
            Account Settings
          </a>
        </li>
      </ul>
    </li>
  );
}

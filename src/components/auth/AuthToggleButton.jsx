import { useEffect, useState, useRef } from 'react';
import { supabase } from '~/lib/supabaseClient';

export default function AuthToggleButton() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const getUserAndRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase.from('users').select('role').eq('id', currentUser.id).single();
        if (data && !error) {
          setRole(data.role);
        }
      }
    };

    getUserAndRole();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single()
          .then(({ data }) => setRole(data?.role ?? null));
      } else {
        setRole(null);
      }
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  const handleLogin = () => {
    window.location.href = '/auth/signin';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const getInitials = (email) => email?.slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="px-3 py-1.5 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex-container">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 text-white text-sm font-semibold flex items-center justify-center shadow-sm ring-1 ring-gray-300"
          aria-label="Open profile menu"
        >
          {getInitials(user.email)}
        </button>

        {/* Mobile sign out */}
        <button onClick={handleLogout} className="md:hidden ml-2 text-sm text-black underline dark:text-white">
          Log Out
        </button>
      </div>

      {menuOpen && (
        <div className="hidden md:block absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user.user_metadata?.full_name || user.email.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            {role && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span className="capitalize">{role}</span>
              </p>
            )}
          </div>

          <div className="py-2 text-sm text-gray-700 dark:text-white">
            <a href="/account/my-bookings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              My Bookings
            </a>
            <a href="/account/account-settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Account Settings
            </a>
            {/* <a href="/account/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Dashboard
            </a> */}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Log Out
            </button>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <button
              className="w-full text-sm font-semibold text-white bg-black rounded px-4 py-2 hover:bg-gray-900"
              onClick={() => (window.location.href = '/account/book-session')}
            >
              Book Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

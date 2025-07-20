import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { user, loading } from '~/stores/authStore';
import { canAccess } from '~/config/authConfig';

export default function PageProtection({ children }) {
  const $user = useStore(user);
  const $loading = useStore(loading);
  const [authReady, setAuthReady] = useState(false);

  // Get current pathname (only in browser)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAccountPage = pathname.startsWith('/account');

  // Wait for AuthInitializer to complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthReady(true);
    }, 100); // Small delay to let AuthInitializer run first
    
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    if (authReady) {
      console.log('PageProtection ready:', { 
        pathname, 
        isAccountPage, 
        user: $user, 
        loading: $loading,
        userStoreValue: user.get(),
        localStorage: localStorage.getItem('user')
      });
    }
  }, [authReady, $user]);

  // Wait for auth to be ready before checking
  if (isAccountPage && !authReady) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Initializing...</span>
      </div>
    );
  }

  if (isAccountPage) {
    // Check if user is authenticated
    if (!$user) {
      // Redirect to unauthorized page with reason
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized?reason=auth_required';
      }

      return null;
    }

    // Check if user has required role for this page
    if (!canAccess(pathname, $user.role)) {
      // Redirect to unauthorized page for insufficient permissions
      if (typeof window !== 'undefined') {
        window.location.href = `/unauthorized?reason=insufficient_role&required=${canAccess.requiredRoles || 'unknown'}`;
      }
      return null;
    }
  }

  // Render children for public pages or authorized users
  return children;
}

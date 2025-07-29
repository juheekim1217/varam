import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { user, loading } from '~/stores/authStore';
import { canAccess } from '~/config/authConfig';

export default function PageProtection({ children }) {
  const $user = useStore(user);
  const $loading = useStore(loading);
  const [authReady, setAuthReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run client-side logic after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current pathname (only in browser)
  const pathname = isClient && typeof window !== 'undefined' ? window.location.pathname : '';
  const isAccountPage = pathname.startsWith('/account');

  // Wait for AuthInitializer to complete
  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      setAuthReady(true);
    }, 100); // Small delay to let AuthInitializer run first

    return () => clearTimeout(timer);
  }, [isClient]);

  // Debug logging
  useEffect(() => {
    if (authReady && isClient) {
      console.log('PageProtection ready:', {
        pathname,
        isAccountPage,
        user: $user,
        loading: $loading,
        userStoreValue: user.get(),
        localStorage: typeof window !== 'undefined' ? localStorage.getItem('user') : null,
      });
    }
  }, [authReady, $user, isClient]);

  // Show loading during SSR and initial hydration
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
      </div>
    );
  }

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

      return <></>; // to avoid React Invalid hook call warning
    }

    // Check if user has required role for this page
    if (!canAccess(pathname, $user.role)) {
      // Redirect to unauthorized page for insufficient permissions
      if (typeof window !== 'undefined') {
        window.location.href = `/unauthorized?reason=insufficient_role&required=${canAccess.requiredRoles || 'unknown'}`;
      }
      return <></>; // to avoid React Invalid hook call warning
    }
  }

  // Render children for public pages or authorized users
  return children;
}

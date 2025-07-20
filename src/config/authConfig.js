// Simple auth config for account pages only
export const AUTH_CONFIG = {
  // Account pages - define required roles
  accountPages: {
    '/account/dashboard': ['admin', 'coach'],
    '/account/book-session': ['admin', 'coach', 'member'],
    '/account/my-bookings': ['admin', 'coach', 'member', 'guest'],
    '/account/account-settings': ['admin', 'coach', 'member', 'guest'],

    // Example admin-only page (uncomment if needed)
    // '/account/admin': ['admin'],
  },
};

// Helper to check if user has required role for page
export function canAccess(pathname, userRole) {
  const requiredRoles = AUTH_CONFIG.accountPages[pathname];
  if (!requiredRoles) return true; // Public page
  return requiredRoles.includes(userRole);
}

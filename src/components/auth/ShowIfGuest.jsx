// src/components/auth/ShowIfGuest.jsx
import { useStore } from '@nanostores/react';

import { user } from '~/stores/authStore';

// This component conditionally renders its children only if the user is not logged in.
export default function ShowIfGuest({ children }) {
  const $user = useStore(user);

  if ($user) return null; // Hide children if logged in

  return children;
}

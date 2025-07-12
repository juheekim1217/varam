import { loading, fetchUser, initAuthListener } from '~/stores/authStore';
import type { UserData } from '~/stores/authStore';

export const initializeAuthListener = async () => {
  loading.set(true);

  // Try to restore cached user
  const cached = localStorage.getItem('user');
  if (cached) {
    try {
      const parsedUser: UserData = JSON.parse(cached);
      const currentUser = await fetchUser();

      if (!currentUser || currentUser.id !== parsedUser.id) {
        localStorage.removeItem('user');
      }
    } catch {
      localStorage.removeItem('user');
    }
  }

  loading.set(false);

  // Initialize auth listener from store
  return initAuthListener();
};

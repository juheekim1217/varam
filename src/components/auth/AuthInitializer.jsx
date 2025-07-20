import { useEffect } from 'react';
import { initializeAuthListener } from '~/lib/initializeAuthListener';

export default function AuthInitializer() {
  useEffect(() => {
    const initialize = async () => {
      const unsubscribe = await initializeAuthListener();
      return () => {
        unsubscribe?.();
      };
    };

    initialize();
  }, []);
  return <div></div>; // This component does not render anything
}

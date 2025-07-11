import { useEffect } from 'react';
import { initializeAuthListener } from '~/lib/initializeAuthListener';

export default function AuthInitializer() {
  useEffect(() => {
    initializeAuthListener();
  }, []);
  return <></>;
}

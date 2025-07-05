import { useEffect } from 'react';

export default function DisableInspect() {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) return;

    const blockContextMenu = (e) => e.preventDefault();
    const blockDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockDevTools);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockDevTools);
    };
  }, []);
  // to avoid React Invalid hook call warning
  return <div></div>;
}

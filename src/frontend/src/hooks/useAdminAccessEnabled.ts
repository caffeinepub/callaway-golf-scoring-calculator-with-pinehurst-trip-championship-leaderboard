import { useState, useEffect } from 'react';
import { isAdminAccessEnabled } from '../state/adminAccess';

/**
 * Custom hook that provides reactive admin access state.
 * Listens to localStorage changes and custom events to update immediately.
 */
export function useAdminAccessEnabled(): boolean {
  const [enabled, setEnabled] = useState(isAdminAccessEnabled());

  useEffect(() => {
    // Update state when custom event is fired
    const handleAdminAccessChange = () => {
      setEnabled(isAdminAccessEnabled());
    };

    // Listen for custom event
    window.addEventListener('admin-access-changed', handleAdminAccessChange);

    // Listen for storage events (changes from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'callaway-admin-access-enabled') {
        setEnabled(isAdminAccessEnabled());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('admin-access-changed', handleAdminAccessChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return enabled;
}

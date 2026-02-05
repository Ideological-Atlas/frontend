import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useUnverifiedWarning() {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.is_verified) {
      const hasSeenWarning = sessionStorage.getItem('atlas_unverified_warning_seen');
      if (!hasSeenWarning) {
        const timer = setTimeout(() => setIsOpen(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const dismiss = () => {
    sessionStorage.setItem('atlas_unverified_warning_seen', 'true');
    setIsOpen(false);
    window.dispatchEvent(new Event('unverified-warning-dismissed'));
  };

  return { isOpen, dismiss };
}

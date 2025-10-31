import { useState, useEffect } from 'react';
import { getCustomSession, isCustomAuthenticated } from '@/utils/customAuth';

export const useCustomAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getCustomSession();
    setUser(session?.user || null);
    setLoading(false);
  }, []);

  const refreshUser = () => {
    const session = getCustomSession();
    setUser(session?.user || null);
  };

  return {
    user,
    loading,
    isAuthenticated: isCustomAuthenticated(),
    refreshUser
  };
};

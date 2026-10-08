import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      loadUser();
    }
  }, [token, user, loadUser]);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
  };
};

export default useAuth;

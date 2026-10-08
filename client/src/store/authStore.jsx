import { create } from 'zustand';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

const TOKEN_KEY = 'notes_auth_token';
const USER_KEY = 'notes_auth_user';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  token: localStorage.getItem(TOKEN_KEY) || null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isAdmin: JSON.parse(localStorage.getItem(USER_KEY) || '{}')?.role === 'admin',
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        loading: false,
        error: null,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await registerUser(userData);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isAdmin: data.user.role === 'admin',
        loading: false,
        error: null,
      });
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  loadUser: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
      return;
    }
    try {
      const user = await getCurrentUser();
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
      });
    } catch (err) {
      // If token expired or invalid, logout
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
    });
  },
}));

export default useAuthStore;

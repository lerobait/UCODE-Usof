import { create } from 'zustand';

interface User {
  id: number;
  login: string;
  email: string;
  token: string;
  role: string;
  profile_picture?: string | null;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Creating a store to manage authentication state and theme preferences
const useAuthStore = create<AuthStore>((set) => ({
  user: null, // Initial state for user is null
  theme: 'light', // Default theme is 'light'

  // Method to set the user and store token and user data in localStorage
  setUser: (user) => {
    localStorage.setItem('authToken', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Method to clear user data from the store and localStorage
  clearUser: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Remove user-specific data (like favorite and like statuses) from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser && storedUser.id) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(`favoriteStatus-${storedUser.id}-`)) {
          localStorage.removeItem(key);
        }
        if (key.startsWith(`likeStatus-${storedUser.id}-`)) {
          localStorage.removeItem(key);
        }
      });
    }

    set({ user: null });
  },

  // Method to set the theme and store it in localStorage
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    document.documentElement.classList.remove('dark', 'light'); // Remove previous theme classes
    document.documentElement.classList.add(theme); // Apply new theme class
  },

  // Method to toggle the theme between light and dark
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'; // Switch theme
      localStorage.setItem('theme', newTheme); // Store the new theme in localStorage
      document.documentElement.classList.remove('dark', 'light'); // Remove previous theme classes
      document.documentElement.classList.add(newTheme); // Apply the new theme class
      return { theme: newTheme };
    });
  },
}));

// Initialize state from localStorage if available

// If authToken and user data exist in localStorage, set the user in the store
const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('user');
if (storedToken && storedUser) {
  const user: User = JSON.parse(storedUser);
  useAuthStore.getState().setUser(user); // Set user data in the store
}

// If theme exists in localStorage, set the theme in the store
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  useAuthStore.getState().setTheme(storedTheme as 'light' | 'dark'); // Set theme to stored theme
} else {
  useAuthStore.getState().setTheme('light'); // Default to light theme if none is stored
}

export default useAuthStore;

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

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => {
    localStorage.setItem('authToken', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

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
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(newTheme);
      return { theme: newTheme };
    });
  },
}));

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('user');
if (storedToken && storedUser) {
  const user: User = JSON.parse(storedUser);
  useAuthStore.getState().setUser(user);
}
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  useAuthStore.getState().setTheme(storedTheme as 'light' | 'dark');
} else {
  useAuthStore.getState().setTheme('light');
}


export default useAuthStore;

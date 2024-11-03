import { create } from 'zustand';

interface User {
  id: number;
  login: string;
  email: string;
  token: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem('authToken', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('user');
if (storedToken && storedUser) {
  const user: User = JSON.parse(storedUser);
  useAuthStore.getState().setUser(user);
}

export default useAuthStore;

// store.js
import { create } from 'zustand';

const storedUser = localStorage.getItem('user-storage');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const useUserStore = create((set,get) => ({
  user: initialUser, // Initialize with user data from localStorage
  setUser: (user) => {
    set({ user });
    localStorage.setItem('user-storage', JSON.stringify(user)); // Persist user data to localStorage
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('user-storage'); // Remove user data from localStorage
  },
  isLoggedIn: () => {
    // Check if the user is logged in by accessing the state
    return get().user !== null;
  },
}));

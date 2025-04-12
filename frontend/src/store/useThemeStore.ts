import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: 'light',
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light',
        isDarkMode: !state.isDarkMode 
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
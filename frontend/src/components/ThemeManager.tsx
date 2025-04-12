'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeManager({ children }: { children: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode, theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.setAttribute('data-theme', theme);
  }, [isDarkMode, theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div>
        {/* Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle flex items-center justify-between px-2"
          data-theme={theme}
          aria-label="Toggle theme"
        >
          <Moon className="w-4 h-4 text-blue-200" />
          <Sun className="w-4 h-4 text-yellow-400" />
          <div className="theme-toggle-thumb" />
        </button>

        {/* Wrapped children */}
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeManager');
  }
  return context;
}

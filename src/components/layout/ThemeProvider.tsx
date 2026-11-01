'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  resolvedTheme: 'dark',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('interview_lab_theme') as Theme | null;
        if (saved) {
          setTheme(saved);
        }
      }
    } catch (e) {
      console.warn('ThemeProvider: Failed to read theme from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      let actualTheme: 'dark' | 'light' = 'dark';

      if (theme === 'system') {
        if (typeof window !== 'undefined' && window.matchMedia) {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      } else {
        actualTheme = theme;
      }

      setResolvedTheme(actualTheme);

      if (actualTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('interview_lab_theme', theme);
      }
    } catch (e) {
      console.warn('ThemeProvider: Failed to apply or save theme', e);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}


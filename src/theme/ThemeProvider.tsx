'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme, Theme } from './index';

type ThemeContextType = {
  theme: Theme;
  themeMode: 'dark' | 'light' | 'matrix';
  setThemeMode: (mode: 'dark' | 'light' | 'matrix') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'matrix'>('dark');
  const [theme, setTheme] = useState<Theme>(darkTheme);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'matrix')) {
      setThemeMode(savedTheme);
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Update theme based on mode
    switch (themeMode) {
      case 'light':
        setTheme(lightTheme);
        break;
      case 'matrix':
      case 'dark':
      default:
        setTheme(darkTheme);
        break;
    }

    // Save theme preference to localStorage
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  const value = {
    theme,
    themeMode,
    setThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
} 
import { useState, useEffect, useCallback } from 'react';

export type ThemeType = 'default' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}
const themes: Record<ThemeType, ThemeConfig> = {
  default: {
    name: 'Default',
    primary: '#3b82f6',
    secondary: '#6366f1',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    border: '#e5e7eb'
  },
  dark: {
    name: 'Dark',
    primary: '#8b5cf6',
    secondary: '#6366f1',
    background: '#111827',
    surface: '#1f2937',
    text: '#ffffff',
    border: '#374151'
  },
  blue: {
    name: 'Blue Ocean',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    background: '#eff6ff',
    surface: '#dbeafe',
    text: '#1e40af',
    border: '#3b82f6'
  },
  green: {
    name: 'Forest Green',
    primary: '#10b981',
    secondary: '#059669',
    background: '#ecfdf5',
    surface: '#d1fae5',
    text: '#065f46',
    border: '#10b981'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    background: '#faf5ff',
    surface: '#ede9fe',
    text: '#6d28d9',
    border: '#8b5cf6'
  }
};
export const useTheme = () => {

  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme && themes[savedTheme] ? savedTheme : 'default';
  });
    const applyTheme = useCallback((themeType: ThemeType) => {

    const config = themes[themeType];
    const root = document.documentElement;

    root.style.setProperty('--color-primary', config.primary);
    root.style.setProperty('--color-secondary', config.secondary);
    root.style.setProperty('--color-background', config.background);
    root.style.setProperty('--color-surface', config.surface);
    root.style.setProperty('--color-text', config.text);
    root.style.setProperty('--color-border', config.border);

    if (themeType === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

  }, []);
    useEffect(() => {

    applyTheme(theme);

  }, [theme, applyTheme]);


  const changeTheme = (themeType: ThemeType) => {

    setTheme(themeType);
    applyTheme(themeType);
    localStorage.setItem('theme', themeType);

  };
    return {

    theme,
    setTheme: changeTheme,
    availableThemes: Object.keys(themes) as ThemeType[],
    currentThemeConfig: themes[theme]

  };

};
import { useEffect, useState } from 'react';
import { storage } from '../../utils';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
      const [isDark, setIsDark] = useState(false);
  const userName = storage.get('userName') || '';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
      useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);
    const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      storage.set('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      storage.set('theme', 'dark');
    }
    setIsDark(!isDark);
  };
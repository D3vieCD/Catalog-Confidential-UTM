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
    return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-20 border-b transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#111827' : '#FFFFFF',
        borderColor: isDark ? '#374151' : '#E5E7EB',
      }}
    >
      <div className="px-6 h-full flex items-center justify-between"></div>
              {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
              Academix Digital
            </h1>
            <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
              {storage.get('userName')}
            </p>
          </div>
        </div>
                {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Caută elevi, clase..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border-0 outline-none transition-all"
              style={{
                backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                color: isDark ? '#F9FAFB' : '#111827',
              }}
            />
          </div>
        </div>
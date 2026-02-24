import { useEffect, useState } from 'react';

interface DividerProps {
  text?: string;
}

export const Divider = ({ text = 'sau continuă cu' }: DividerProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" style={{ borderColor: isDark ? '#4B5563' : '#D1D5DB' }}></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span 
          className="px-4 font-medium"
          style={{ 
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            color: isDark ? '#9CA3AF' : '#6B7280'
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
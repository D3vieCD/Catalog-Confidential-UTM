import { useEffect, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#D1D5DB' : '#374151' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
          fullWidth ? 'w-full' : ''
        } ${className}`.trim()}
        style={{
          backgroundColor: isDark ? '#374151' : '#FFFFFF',
          borderColor: error ? (isDark ? '#EF4444' : '#EF4444') : (isDark ? '#4B5563' : '#D1D5DB'),
          color: isDark ? '#F9FAFB' : '#111827'
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

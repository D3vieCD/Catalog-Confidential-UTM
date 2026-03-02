interface SettingsInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  showPasswordToggle?: boolean;
}
import React from 'react';

export const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  disabled = false,
  showPasswordToggle = false
}) => {
  return (
    <div>
    </div>
  );
};
const [showPassword, setShowPassword] = React.useState(false);
const inputType = type === 'password' && showPassword ? 'text' : type;
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {label}
  </label>
  <div className="relative">
    <input />
  </div>
</div>
{icon && (
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
    {icon}
  </div>
)}
<input
  type={inputType}
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
  disabled={disabled}
  className={`w-full ${icon ? 'pl-12' : 'pl-4'} ${
    showPasswordToggle ? 'pr-12' : 'pr-4'
  } py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`}
/>
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
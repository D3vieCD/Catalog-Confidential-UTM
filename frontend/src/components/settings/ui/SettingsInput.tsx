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
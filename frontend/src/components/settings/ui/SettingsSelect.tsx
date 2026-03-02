interface SettingsSelectOption {
  value: string;
  label: string;
}
interface SettingsSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SettingsSelectOption[];
  icon?: React.ReactNode;
}
import React from 'react';

export const SettingsSelect: React.FC<SettingsSelectProps> = ({
  label,
  value,
  onChange,
  options,
  icon
}) => {
  return (
    <div>
    </div>
  );
};
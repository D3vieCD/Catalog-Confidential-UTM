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
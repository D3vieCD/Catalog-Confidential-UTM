interface SettingsAlertProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
}
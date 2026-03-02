interface SettingsAlertProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
}
import React from 'react';

export const SettingsAlert: React.FC<SettingsAlertProps> = ({
  type,
  title,
  message
}) => {
  return (
    <div>
    </div>
  );
};
const colors = {
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
};
const icons = {
  info: ( <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">...</svg> ),
  warning: ( <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">...</svg> ),
  success: ( <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">...</svg> ),
  error: ( <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">...</svg> )
};
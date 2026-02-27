interface PreferencesData {
  language: string;
  timezone: string;
}
interface SettingsPreferencesProps {
  preferences: PreferencesData;
  setPreferences: (preferences: PreferencesData) => void;
}
import React from 'react';
import { SettingsSelect } from '../ui';

export const SettingsPreferences: React.FC<SettingsPreferencesProps> = ({
  preferences,
  setPreferences
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      </div>
    </div>
  );
};
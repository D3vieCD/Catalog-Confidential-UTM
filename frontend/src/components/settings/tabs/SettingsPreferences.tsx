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
<SettingsSelect
  label="Limba Interfeței"
  value={preferences.language}
  onChange={(value) =>
    setPreferences({ ...preferences, language: value })
  }
  options={[
    { value: 'ro-MD', label: 'Română (Republica Moldova)' },
    { value: 'ro-RO', label: 'Română (România)' },
    { value: 'ru-RU', label: 'Русский' },
    { value: 'en-US', label: 'English (US)' }
  ]}
/>
<SettingsSelect
  label="Fus Orar"
  value={preferences.timezone}
  onChange={(value) =>
    setPreferences({ ...preferences, timezone: value })
  }
  options={[
    { value: 'GMT+02:00', label: '(GMT+02:00) Chișinău' },
    { value: 'GMT+03:00', label: '(GMT+03:00) București' },
    { value: 'GMT+00:00', label: '(GMT+00:00) Londra' },
    { value: 'GMT-05:00', label: '(GMT-05:00) New York' }
  ]}
/>
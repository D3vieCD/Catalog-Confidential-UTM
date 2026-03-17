import React, { useState } from 'react';
import { SettingsInput } from '../ui';

interface SecurityData {
  current: string;
  new: string;
  confirm: string;
}

interface SettingsSecurityProps {
  security: SecurityData;
  setSecurity: (security: SecurityData) => void;
}

type MessageType = 'error' | 'success' | null;

export const SettingsSecurity: React.FC<SettingsSecurityProps> = ({ security, setSecurity }) => {
  const [message, setMessage] = useState<{ type: MessageType; text: string }>({ type: null, text: '' });

  const handleChangePassword = () => {
    // Validare
    if (!security.current || !security.new || !security.confirm) {
      setMessage({ type: 'error', text: 'Te rog completează toate câmpurile!' });
      return;
    }

    if (security.new !== security.confirm) {
      setMessage({ type: 'error', text: 'Parolele nu coincid!' });
      return;
    }

    if (security.new.length < 6) {
      setMessage({ type: 'error', text: 'Parola nouă trebuie să aibă cel puțin 6 caractere!' });
      return;
    }

    // TODO: Implementează logica de schimbare a parolei
    console.log('Schimbă parola...', security);
    setMessage({ type: 'success', text: 'Parola a fost schimbată cu succes!' });

    // Reset form after 2 seconds
    setTimeout(() => {
      setSecurity({ current: '', new: '', confirm: '' });
      setMessage({ type: null, text: '' });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <SettingsInput
        label="Parola Curentă"
        value={security.current}
        onChange={(value) => setSecurity({ ...security, current: value })}
        type="password"
        showPasswordToggle
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsInput
          label="Nouă Parolă"
          value={security.new}
          onChange={(value) => setSecurity({ ...security, new: value })}
          type="password"
          showPasswordToggle
        />
        <SettingsInput
          label="Confirmă Parola"
          value={security.confirm}
          onChange={(value) => setSecurity({ ...security, confirm: value })}
          type="password"
          showPasswordToggle
        />
      </div>

      <div className="pt-4">
        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            Schimbă Parola
          </button>
        </div>

        {/* Message Display */}
        {message.type && (
          <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          }`}>
            {message.type === 'error' ? (
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            )}
            <span className={`text-sm font-medium ${
              message.type === 'error'
                ? 'text-red-800 dark:text-red-300'
                : 'text-green-800 dark:text-green-300'
            }`}>
              {message.text}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

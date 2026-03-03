import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
  SettingsProfile,
  SettingsSecurity,
  SettingsNotifications,
  SettingsPreferences
} from '../components/settings/tabs';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences';
type MessageType = 'error' | 'success' | null;

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { getUser, updateUser } = useAuth();
  const currentUser = getUser();
  const [saveMessage, setSaveMessage] = useState<{ type: MessageType; text: string }>({ type: null, text: '' });

  // Profile state
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+373 60 000 000',
    role: currentUser.role === 'admin' ? 'Administrator' : 'Profesor de Matematică',
    bio: 'Pasionat de educație și tehnologie. Predau de peste 10 ani la Liceul Teoretic din Chișinău.'
  });

  // Security state
  const [security, setSecurity] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Notifications state - încarcă din localStorage dacă există
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('userNotifications');
    return saved ? JSON.parse(saved) : {
      emailUpdates: true,
      pushNotifications: true,
      studentMessages: false,
      securityAlerts: true
    };
  });

  // Preferences state - încarcă din localStorage dacă există
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      language: 'ro-MD',
      timezone: 'GMT+02:00'
    };
  });
  const tabs = [
    {
      id: 'profile' as SettingsTab,
      label: 'Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      )
    },
    {
      id: 'security' as SettingsTab,
      label: 'Securitate',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      )
    },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notificări',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      )
    },
    {
      id: 'preferences' as SettingsTab,
      label: 'Preferințe',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
      )
    }
  ];

  const handleSave = () => {
    try {
      // Salvează toate modificările
      updateUser({
        name: profile.name,
        email: profile.email,
        role: profile.role,
      });

      // Salvează notificările și preferințele în localStorage
      localStorage.setItem('userNotifications', JSON.stringify(notifications));
      localStorage.setItem('userPreferences', JSON.stringify(preferences));

      setSaveMessage({ type: 'success', text: 'Setările au fost salvate cu succes!' });

      // Ascunde mesajul după 3 secunde
      setTimeout(() => {
        setSaveMessage({ type: null, text: '' });
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'A apărut o eroare la salvarea setărilor!' });
      console.error('Error saving settings:', error);
    }
  };
  return (
    <div className="space-y-6 min-h-full pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Setările Contului
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Administrează-ți profilul și preferințele aplicației
          </p>
        </div>
        <div className="w-full sm:w-auto space-y-3">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            <span className="hidden sm:inline">Salvează Modificările</span>
            <span className="sm:hidden">Salvează</span>
          </button>

          {/* Save Message */}
          {saveMessage.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-xl flex items-center gap-2 text-sm ${
                saveMessage.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              }`}
            >
              {saveMessage.type === 'error' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="font-medium">{saveMessage.text}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px]">
            {activeTab === 'profile' && (
              <SettingsProfile profile={profile} setProfile={setProfile} />
            )}

            {activeTab === 'security' && (
              <SettingsSecurity security={security} setSecurity={setSecurity} />
            )}

            {activeTab === 'notifications' && (
              <SettingsNotifications notifications={notifications} setNotifications={setNotifications} />
            )}

            {activeTab === 'preferences' && (
              <SettingsPreferences preferences={preferences} setPreferences={setPreferences} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
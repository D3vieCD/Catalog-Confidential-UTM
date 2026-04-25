import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useSettings from '../hooks/useSettings';
import {
  SettingsProfile,
  SettingsSecurity,
} from '../components/settings/tabs';

type SettingsTab = 'profile' | 'security';
type MessageType = 'error' | 'success' | null;

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { getUser, updateUser } = useAuth();
  const { getProfile, updateProfile, loading } = useSettings();
  const currentUser = getUser();

  const [saveMessage, setSaveMessage] = useState<{ type: MessageType; text: string }>({ type: null, text: '' });

  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '',
    role: currentUser.role,
    bio: '',
    avatar: currentUser.avatar || '',
  });

  const [security, setSecurity] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile({
          name: data.userName,
          email: data.email,
          phone: data.phone ?? '',
          role: data.role,
          bio: data.bio ?? '',
          avatar: data.avatar ?? '',
        });
        if (data.avatar) updateUser({ avatar: data.avatar });
      })
      .catch(() => {});
  }, []);

  const tabs = [
    {
      id: 'profile' as SettingsTab,
      label: 'Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
    },
    {
      id: 'security' as SettingsTab,
      label: 'Securitate',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      ),
    },
  ];

  const handleSave = async () => {
    try {
      await updateProfile({
        userName: profile.name,
        phone: profile.phone || null,
        bio: profile.bio || null,
        avatar: profile.avatar || null,
      });

      updateUser({ name: profile.name, email: profile.email, avatar: profile.avatar || undefined });

      setSaveMessage({ type: 'success', text: 'Setările au fost salvate cu succes!' });
      setTimeout(() => setSaveMessage({ type: null, text: '' }), 3000);
    } catch (err: any) {
      const msg = err?.response?.data || 'A apărut o eroare la salvarea setărilor!';
      setSaveMessage({ type: 'error', text: msg });
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
          {activeTab === 'profile' && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                </svg>
              )}
              <span className="hidden sm:inline">Salvează Modificările</span>
              <span className="sm:hidden">Salvează</span>
            </button>
          )}

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
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

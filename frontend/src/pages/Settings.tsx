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
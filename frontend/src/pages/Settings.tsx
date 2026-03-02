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
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Bell } from 'lucide-react';
import { DarkModeToggle } from '../../components/ui';
import paths from '../../routes/paths';
import { useAuth } from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

interface UpcomingNotif {
  eventId: number;
  title: string;
  startDate: Date;
  eventType: string;
  color: string;
  urgencyLabel: string;
  urgencyColor: string;
  notifKey: string;
  isSeen: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  exam:     { label: 'Examen',       icon: '📝' },
  class:    { label: 'Curs',         icon: '📚' },
  meeting:  { label: 'Ședință',      icon: '👥' },
  deadline: { label: 'Termen limită', icon: '⏰' },
  holiday:  { label: 'Zi liberă',    icon: '🎉' },
};

function getUrgency(msUntil: number): { label: string; color: string } {
  const hours = msUntil / 1000 / 3600;
  if (hours <= 1)   return { label: 'în mai puțin de 1 oră', color: 'text-red-600 dark:text-red-400' };
  if (hours <= 24)  return { label: `în ${Math.ceil(hours)} ore`, color: 'text-orange-500 dark:text-orange-400' };
  if (hours <= 48)  return { label: 'mâine', color: 'text-amber-500 dark:text-amber-400' };
  const days = Math.ceil(hours / 24);
  return { label: `în ${days} zile`, color: 'text-blue-500 dark:text-blue-400' };
}

function getNotifKey(eventId: number, msUntil: number): string {
  const hours = msUntil / 1000 / 3600;
  if (hours <= 1)  return `${eventId}-1hour`;
  if (hours <= 24) return `${eventId}-1day`;
  return `${eventId}-5days`;
}

export const Header = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const axios = useAxios();
  const currentUser = getUser();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<UpcomingNotif[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get<{
        eventId: number; title: string; startDate: string;
        eventType: string; color: string; notifKey: string; isSeen: boolean;
      }[]>('/notifications');
      const now = new Date();
      const notifs: UpcomingNotif[] = (data || []).map(n => {
        const d = new Date(n.startDate);
        const urgency = getUrgency(d.getTime() - now.getTime());
        return {
          eventId: n.eventId,
          title: n.title,
          startDate: d,
          eventType: n.eventType,
          color: n.color,
          urgencyLabel: urgency.label,
          urgencyColor: urgency.color,
          notifKey: n.notifKey,
          isSeen: n.isSeen,
        };
      });
      setNotifications(notifs);
    } catch {
      // nu afectăm UI-ul dacă fetch-ul eșuează
    }
  }, [axios]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const hasNew = notifications.some(n => !n.isSeen);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    const unseenKeys = notifications.filter(n => !n.isSeen).map(n => n.notifKey);
    if (unseenKeys.length > 0) {
      axios.post('/notifications/seen', { notifKeys: unseenKeys })
        .then(() => {
          setNotifications(prev => prev.map(n => ({ ...n, isSeen: true })));
        })
        .catch(() => {});
    }
  };

  const handleCloseNotifications = () => setShowNotifications(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 z-30 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <button
          onClick={() => navigate(paths.dashboard)}
          className="flex items-center gap-3 p-2 rounded-2xl hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          title="Acasă"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Home className="w-6 h-6 text-white" />
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-bold text-lg whitespace-nowrap text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
          >
            Academix Catalogul Digital
          </motion.span>
        </button>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            {showNotifications && (
              <div className="fixed inset-0 z-10" onClick={handleCloseNotifications} />
            )}

            <motion.button
              type="button"
              onClick={showNotifications ? handleCloseNotifications : handleOpenNotifications}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
              whileHover={{ rotate: [0, -20, 20, -15, 15, -8, 8, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Bell className="w-6 h-6" />
              <AnimatePresence>
                {hasNew && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
                  />
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notificări Calendar</h3>
                    {notifications.length > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-2xl mb-2">🗓️</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Niciun eveniment în următoarele 5 zile
                        </p>
                      </div>
                    ) : (
                      notifications.map(notif => {
                        const cfg = TYPE_CONFIG[notif.eventType] ?? TYPE_CONFIG['class'];
                        const dateStr = notif.startDate.toLocaleDateString('ro-RO', {
                          day: '2-digit', month: 'short',
                        });
                        const timeStr = notif.startDate.toLocaleTimeString('ro-RO', {
                          hour: '2-digit', minute: '2-digit',
                        });
                        return (
                          <div
                            key={notif.notifKey}
                            onClick={() => { handleCloseNotifications(); navigate(paths.dashboardRoutes.calendar); }}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notif.isSeen ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}
                          >
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                              style={{ backgroundColor: notif.color + '22' }}
                            >
                              {cfg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{notif.title}</p>
                                {!notif.isSeen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{cfg.label}</span>
                                <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{dateStr} {timeStr}</span>
                              </div>
                              <span className={`text-xs font-semibold mt-0.5 block ${notif.urgencyColor}`}>
                                ⏰ {notif.urgencyLabel}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => { handleCloseNotifications(); navigate(paths.dashboardRoutes.calendar); }}
                      className="w-full py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                    >
                      Vezi tot calendarul →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode */}
          <DarkModeToggle variant="inline" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.role === 'admin' ? 'Administrator' : 'Profesor'}
              </div>
            </div>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                {currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

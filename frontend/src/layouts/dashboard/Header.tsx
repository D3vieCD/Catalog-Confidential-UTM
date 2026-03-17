import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '../../components/ui';
import { paths } from '../../routes/paths';
import { useAuth } from '../../hooks/useAuth';
import { mockCalendarEvents } from '../../_mock/mockCalendar';
import type { CalendarEvent } from '../../_mock/mockCalendar';

const TYPE_CONFIG: Record<CalendarEvent['type'], { label: string; bg: string; text: string; icon: string }> = {
  exam:     { label: 'Examen',   bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-600 dark:text-red-400',    icon: '📝' },
  class:    { label: 'Curs',     bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-600 dark:text-blue-400',   icon: '📚' },
  meeting:  { label: 'Ședință',  bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', icon: '👥' },
  deadline: { label: 'Deadline', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', icon: '⏰' },
  holiday:  { label: 'Zi liberă', bg: 'bg-gray-100 dark:bg-gray-700',    text: 'text-gray-600 dark:text-gray-400',  icon: '🎉' },
};

/**
 * Header - Bară de navigare superioară cu logo home, căutare și profil
 */
export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const currentUser = getUser();

  const sortedEvents = [...mockCalendarEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const goToHome = () => {
    navigate(paths.dashboard);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 z-30 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Home Button */}
        <button
          onClick={goToHome}
          className="flex items-center gap-3 p-2 rounded-2xl hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          title="Acasă"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-bold text-lg whitespace-nowrap text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            Academix Catalogul Digital
          </motion.span>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută studenți, grupe..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            {showNotifications && (
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
            )}
            <motion.button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
              whileHover={{ rotate: [0, -20, 20, -15, 15, -8, 8, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
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
                  {/* Header dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notificări Calendar</h3>
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                      {sortedEvents.length}
                    </span>
                  </div>

                  {/* Events list */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {sortedEvents.map((event) => {
                      const cfg = TYPE_CONFIG[event.type];
                      const dateStr = new Date(event.date).toLocaleDateString('ro-RO', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      });
                      return (
                        <div
                          key={event.id}
                          onClick={() => { setShowNotifications(false); navigate(paths.dashboardRoutes.calendar); }}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${cfg.bg}`}>
                            {cfg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{event.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{dateStr}</span>
                            </div>
                            {event.startTime !== '00:00' && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {event.startTime} – {event.endTime}
                                {event.location ? ` · ${event.location}` : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => { setShowNotifications(false); navigate(paths.dashboardRoutes.calendar); }}
                      className="w-full py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      Vezi tot calendarul →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <DarkModeToggle variant="inline" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {currentUser.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser.role === 'admin' ? 'Administrator' : 'Profesor'}
              </div>
            </div>
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

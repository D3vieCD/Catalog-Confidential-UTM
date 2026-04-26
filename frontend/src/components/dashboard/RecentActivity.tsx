import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Activity {
  id: number;
  studentName: string;
  action: string;
  details: string;
  time: string;
  type: 'grade' | 'absence' | 'other';
}

interface RecentActivityProps {
  activities: Activity[];
}

const PREVIEW_COUNT = 5;

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'grade':
      return (
        <div className="w-9 h-9 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      );
    case 'absence':
      return (
        <div className="w-9 h-9 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-9 h-9 rounded-2xl bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-stone-500 dark:text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
      );
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const [showAll, setShowAll] = useState(false);

  const hasMore = activities.length > PREVIEW_COUNT;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activitate Recentă
        </h3>
        {hasMore && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            {showAll ? 'Vezi mai puțin' : 'Vezi toate'}
          </button>
        )}
      </div>

      <div
        className="space-y-4 overflow-y-auto transition-all duration-300 pr-1"
        style={{ maxHeight: showAll ? '420px' : 'none' }}
      >
        {activities.slice(0, PREVIEW_COUNT).map((activity) => (
          <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.studentName}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {activity.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.details}
              </p>
            </div>
          </div>
        ))}

        <AnimatePresence>
          {showAll && activities.slice(PREVIEW_COUNT).map((activity, i) => (
            <motion.div
              key={`${activity.type}-${activity.id}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, delay: i * 0.03 }}
              className="flex items-start space-x-3"
            >
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.studentName}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.details}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

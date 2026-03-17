import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGroups } from '../_mock/mockGroups';
import { getStudents } from '../_mock/mockStudents';

/**
 * Catalog - Pagina principală cu lista de grupe
 * Selectează o grupă pentru a vizualiza catalogul
 */
export const Catalog = () => {
  const navigate = useNavigate();
  const [groups] = useState(() => getGroups().filter(g => g.status === 'ACTIV'));
  const [students] = useState(() => getStudents());

  // Calculează numărul de studenți pentru fiecare grupă
  const groupsWithStudentCount = useMemo(() => {
    return groups.map(group => ({
      ...group,
      studentCount: students.filter(s => s.group === group.name && s.status === 'active').length,
    }));
  }, [groups, students]);

  const handleGroupClick = (groupId: string) => {
    navigate(`/dashboard/catalog/${groupId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Catalog Digital
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Selectează o grupă pentru a vizualiza catalogul
        </p>
      </motion.div>

      {/* Grid de Grupe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {groupsWithStudentCount.map((group, index) => (
          <motion.button
            key={group.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleGroupClick(group.id)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-left group"
          >
            {/* Icon & Nume Grupă */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  ANUL {group.year}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <span className="text-sm font-medium">{group.studentCount} studenți</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <span className="text-sm">{group.specialization}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Empty State */}
      {groupsWithStudentCount.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nu există grupe active
          </p>
        </motion.div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_SYSTEM_SETTINGS } from '../_mock/mockAdminData';

/**
 * AdminSettings - Setări sistem
 */

export const AdminSettings = () => {
  const [institutionName, setInstitutionName] = useState(MOCK_SYSTEM_SETTINGS.institutionName);
  const [currentYear, setCurrentYear] = useState(MOCK_SYSTEM_SETTINGS.currentYear);
  const [subjects, setSubjects] = useState<string[]>(MOCK_SYSTEM_SETTINGS.subjects);
  const [newSubject, setNewSubject] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects((prev) => [...prev, trimmed]);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (subject: string) => {
    setSubjects((prev) => prev.filter((s) => s !== subject));
  };

  const handleReset = () => {
    setInstitutionName(MOCK_SYSTEM_SETTINGS.institutionName);
    setCurrentYear(MOCK_SYSTEM_SETTINGS.currentYear);
    setSubjects(MOCK_SYSTEM_SETTINGS.subjects);
    setSaved(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Titlu */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Setări Sistem</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configurare instituție și parametri sistem
        </p>
      </div>

      {/* Setări instituție */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-4"
      >
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Configurare Instituție</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nume instituție
          </label>
          <input
            type="text"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            An școlar curent
          </label>
          <input
            type="text"
            value={currentYear}
            onChange={(e) => setCurrentYear(e.target.value)}
            placeholder="2025-2026"
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
      </motion.div>

      {/* Materii */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 space-y-4"
      >
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Materii Disponibile</h2>

        {/* Adaugă materie */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubject(); }}
            placeholder="Adaugă materie nouă..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          />
          <button
            onClick={handleAddSubject}
            disabled={!newSubject.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Adaugă
          </button>
        </div>

        {/* Lista materii */}
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
            >
              {subject}
              <button
                onClick={() => handleDeleteSubject(subject)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {subjects.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Nicio materie adăugată.</p>
          )}
        </div>
      </motion.div>

      {/* Acțiuni */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvat!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Salvează modificările
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-stone-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Resetare date demo
        </button>
      </motion.div>
    </div>
  );
};

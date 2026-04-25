import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGroups from '../../hooks/useGroups';
import useStudents from '../../hooks/useStudents';
import useReports from '../../hooks/useReports';
import type { Group } from '../../context/GroupProvider';
import type { Student } from '../../context/StudentProvider';
import { CustomSelect } from '../ui/CustomSelect';

interface ExportSectionProps {
  onReportGenerated: () => void;
}

type ReportType = 'Note' | 'Absente' | 'Complet';
type Scope = 'grupa' | 'student';

export const ExportSection = ({ onReportGenerated }: ExportSectionProps) => {
  const { getAllGroups } = useGroups();
  const { getAllStudents } = useStudents();
  const { generateReport, loading } = useReports();

  const [groups, setGroups] = useState<Group[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [reportType, setReportType] = useState<ReportType>('Note');
  const [scope, setScope] = useState<Scope>('grupa');
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);

  useEffect(() => {
    getAllGroups()
      .then((data) => {
        setGroups(data);
        if (data.length > 0) setSelectedGroupId(data[0].id);
      })
      .catch(() => {});
    getAllStudents()
      .then(setAllStudents)
      .catch(() => {});
  }, []);

  const studentsInGroup = useMemo(
    () => allStudents.filter((s) => s.groupId === selectedGroupId),
    [allStudents, selectedGroupId]
  );

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(Number(value));
    setSelectedStudentId(0);
  };

  const handleExport = async () => {
    if (!selectedGroupId) return;
    if (scope === 'student' && !selectedStudentId) return;

    try {
      await generateReport({
        groupId: selectedGroupId,
        studentId: scope === 'student' ? selectedStudentId : undefined,
        reportType,
        format: 'XLSX',
      });
      onReportGenerated();
    } catch {
      alert('Eroare la generarea raportului. Verifică că grupa are date (note/absențe) și că serverul este activ.');
    }
  };

  const reportTypes = [
    { id: 'Note' as const, label: 'Doar Note' },
    { id: 'Absente' as const, label: 'Doar Absențe' },
    { id: 'Complet' as const, label: 'Raport Complet (Note + Absențe)' },
  ];

  const canExport = selectedGroupId > 0 && (scope === 'grupa' || selectedStudentId > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Descarcă Raport</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Export date în format Excel</p>
        </div>
      </div>

      {/* Selectează Grupa */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Selectează Grupa
        </label>
        <CustomSelect
          value={String(selectedGroupId)}
          onChange={handleGroupChange}
          options={groups.map((g) => ({ value: String(g.id), label: `${g.groupName} — ${g.specialization}` }))}
        />
      </div>

      {/* Scope toggle */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Raport pentru
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: 'grupa', label: 'Toată Grupa', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            )},
            { id: 'student', label: 'Student Specific', icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            )},
          ] as { id: Scope; label: string; icon: React.ReactNode }[]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setScope(opt.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                scope === opt.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student dropdown */}
      <AnimatePresence>
        {scope === 'student' && (
          <motion.div
            key="student-select"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Selectează Studentul
            </label>
            {studentsInGroup.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic px-1">
                Nu există studenți în această grupă.
              </p>
            ) : (
              <CustomSelect
                value={String(selectedStudentId)}
                onChange={(v) => setSelectedStudentId(Number(v))}
                placeholder="— Alege un student —"
                options={studentsInGroup.map((s) => ({ value: String(s.id), label: s.fullName }))}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip Raport */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Tip Raport
        </label>
        <div className="space-y-2">
          {reportTypes.map((type) => (
            <label
              key={type.id}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                reportType === type.id
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <input
                type="radio"
                name="reportType"
                value={type.id}
                checked={reportType === type.id}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buton Export */}
      <button
        onClick={handleExport}
        disabled={!canExport || loading}
        className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Se generează...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Descarcă Excel
          </>
        )}
      </button>

      {/* Info */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex gap-2 text-sm text-blue-800 dark:text-blue-200">
          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>
            Fișierul Excel se descarcă direct în browser, gata de deschis în Excel sau Google Sheets.
          </span>
        </div>
      </div>
    </motion.div>
  );
};

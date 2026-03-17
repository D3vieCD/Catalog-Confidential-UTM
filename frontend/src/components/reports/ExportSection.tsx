import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { getGroups } from '../../_mock/mockGroups';
import { getStudents } from '../../_mock/mockStudents';
import { getStudentGrades, getStudentAbsences } from '../../_mock/mockGrades';
import { addReport } from '../../_mock/mockReports';
import type { Report } from '../../_mock/mockReports';
import { CustomSelect } from '../ui/CustomSelect';

interface ExportSectionProps {
  onReportGenerated: (report: Report) => void;
}

type ReportType = 'note' | 'absente' | 'complet';
type Scope = 'grupa' | 'student';

export const ExportSection = ({ onReportGenerated }: ExportSectionProps) => {
  const groups = getGroups().filter(g => g.status === 'ACTIV');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id || '');
  const [reportType, setReportType] = useState<ReportType>('note');
  const [scope, setScope] = useState<Scope>('grupa');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const group = groups.find(g => g.id === selectedGroup);

  const studentsInGroup = useMemo(() => {
    if (!group) return [];
    return getStudents().filter(s => s.group === group.name && s.status === 'active');
  }, [selectedGroup, group]);

  // Când se schimbă grupa, resetăm studentul selectat
  const handleGroupChange = (id: string) => {
    setSelectedGroup(id);
    setSelectedStudentId('');
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const buildWorkbook = (studentIds: string[], type: ReportType) => {
    const wb = XLSX.utils.book_new();
    const today = fmt(new Date().toISOString());
    const subjects = group!.subjects.length > 0 ? group!.subjects : ['—'];

    subjects.forEach(subject => {
      const aoa: (string | number)[][] = [];

      // ── Secțiune META ──
      aoa.push(['CATALOG ACADEMIC — ' + group!.name]);
      aoa.push(['Grupă:', group!.name, '', 'Specializare:', group!.specialization]);
      aoa.push(['Coordonator:', group!.coordinator, '', 'An studiu:', `Anul ${group!.year}`]);
      aoa.push(['Materie:', subject, '', 'Data raport:', today]);
      aoa.push([]);

      if (type === 'note' || type === 'complet') {
        // ── Găsim numărul maxim de note pentru aliniere coloane ──
        const allGrades = studentIds.map(id =>
          getStudentGrades(id, subject).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        const maxGrades = Math.max(...allGrades.map(g => g.length), 0);

        // Header note
        const noteHeader: (string | number)[] = ['#', 'Nume Student', 'Email', 'Grupă'];
        for (let i = 1; i <= maxGrades; i++) {
          noteHeader.push(`Notă ${i}`, `Data ${i}`);
        }
        noteHeader.push('Medie');
        if (type === 'complet') noteHeader.push('Absențe Nemotivate', 'Absențe Motivate', 'Total Absențe');
        aoa.push(noteHeader);

        // Rânduri studenți
        studentIds.forEach((id, idx) => {
          const s = getStudents().find(st => st.id === id);
          if (!s) return;
          const grades = allGrades[idx];
          const validGrades = grades.filter(g => g.value !== null);
          const avg = validGrades.length > 0
            ? (validGrades.reduce((sum, g) => sum + (g.value || 0), 0) / validGrades.length).toFixed(2)
            : '—';

          const row: (string | number)[] = [idx + 1, s.name, s.email, s.group];
          for (let i = 0; i < maxGrades; i++) {
            row.push(grades[i]?.value ?? '—', grades[i] ? fmt(grades[i].date) : '—');
          }
          row.push(avg);

          if (type === 'complet') {
            const absences = getStudentAbsences(id, subject);
            const nemotivate = absences.filter(a => !a.motivated).length;
            const motivate = absences.filter(a => a.motivated).length;
            row.push(nemotivate, motivate, absences.length);
          }
          aoa.push(row);
        });
      } else {
        // ── DOAR ABSENȚE ──
        aoa.push(['#', 'Nume Student', 'Email', 'Grupă', 'Data Absenței', 'Motivată']);

        studentIds.forEach((id, idx) => {
          const s = getStudents().find(st => st.id === id);
          if (!s) return;
          const absences = getStudentAbsences(id, subject)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          if (absences.length === 0) {
            aoa.push([idx + 1, s.name, s.email, s.group, '—', '—']);
          } else {
            absences.forEach((ab, ai) => {
              aoa.push([
                ai === 0 ? idx + 1 : '',
                ai === 0 ? s.name : '',
                ai === 0 ? s.email : '',
                ai === 0 ? s.group : '',
                fmt(ab.date),
                ab.motivated ? 'Da' : 'Nu',
              ]);
            });
          }
        });
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // Lățimi coloane automate
      ws['!cols'] = [
        { wch: 4 }, { wch: 24 }, { wch: 28 }, { wch: 10 },
        ...Array(20).fill({ wch: 10 }),
      ];

      // Merge pentru titlu
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

      const sheetName = subject.slice(0, 30);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    return wb;
  };

  const handleExport = async () => {
    if (!group) return;
    if (scope === 'student' && !selectedStudentId) return;

    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 400));

    const ids = scope === 'grupa'
      ? studentsInGroup.map(s => s.id)
      : [selectedStudentId];

    const wb = buildWorkbook(ids, reportType);

    const scopeLabel = scope === 'grupa'
      ? group.name
      : (getStudents().find(s => s.id === selectedStudentId)?.name?.replace(' ', '_') || 'student');
    const fileName = `raport_${scopeLabel}_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    XLSX.writeFile(wb, fileName);

    const report = addReport(selectedGroup, group.name, reportType);
    onReportGenerated(report);
    setIsGenerating(false);
  };

  const reportTypes = [
    { id: 'note' as const, label: 'Doar Note', icon: '📝' },
    { id: 'absente' as const, label: 'Doar Absențe', icon: '📅' },
    { id: 'complet' as const, label: 'Raport Complet (Note + Absențe)', icon: '📊' },
  ];

  const canExport = group && (scope === 'grupa' || selectedStudentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          value={selectedGroup}
          onChange={handleGroupChange}
          options={groups.map(g => ({ value: g.id, label: `${g.name} — ${g.specialization}` }))}
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
          ] as { id: Scope; label: string; icon: React.ReactNode }[]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setScope(opt.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                scope === opt.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student dropdown (dacă scope = student) */}
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
                Nu există studenți activi în această grupă.
              </p>
            ) : (
              <CustomSelect
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                placeholder="— Alege un student —"
                options={studentsInGroup.map(s => ({ value: s.id, label: s.name }))}
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
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-transparent bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <input
                type="radio"
                name="reportType"
                value={type.id}
                checked={reportType === type.id}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Buton Export */}
      <button
        onClick={handleExport}
        disabled={!canExport || isGenerating}
        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {isGenerating ? (
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
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { X, Users2, BookOpen, User, GraduationCap, BarChart3, ChevronRight, Download, Pencil, ArrowLeft } from 'lucide-react';
import type { Group } from '../../context/GroupProvider';
import type { UIStudent } from '../../context/StudentProvider';
import { getInitials } from '../../context/StudentProvider';
import type { Grade } from '../../context/GradeProvider';
import type { Absence } from '../../context/AbsenceProvider';
import useStudents from '../../hooks/useStudents';
import useGrades from '../../hooks/useGrades';
import useAbsences from '../../hooks/useAbsences';

interface GroupDetailPanelProps {
  group: Group | null;
  onClose: () => void;
  onEdit: (group: Group) => void;
}

type SortMode = 'alpha' | 'avg';
type Tab = 'note' | 'absente';

const fmtShort = (iso: string) =>
  new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const GroupDetailPanel: React.FC<GroupDetailPanelProps> = ({ group, onClose, onEdit }) => {
  const [sortMode, setSortMode] = useState<SortMode>('alpha');
  const [students, setStudents] = useState<UIStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<UIStudent | null>(null);

  // Group-level stats
  const [groupGrades, setGroupGrades] = useState<Grade[]>([]);
  const [groupAbsences, setGroupAbsences] = useState<Absence[]>([]);

  // Student detail state
  const [activeTab, setActiveTab] = useState<Tab>('note');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [fetching, setFetching] = useState(false);

  const { getAllStudents } = useStudents();
  const { getGradesByStudentId } = useGrades();
  const { getAbsencesByStudentId } = useAbsences();

  useEffect(() => {
    if (!group) { setStudents([]); setGroupGrades([]); setGroupAbsences([]); return; }
    getAllStudents()
      .then(async all => {
        const filtered = all
          .filter(s => s != null && s.groupId === group.id)
          .map(s => ({
            id: String(s.id),
            name: s.fullName,
            email: s.email,
            phoneNumber: s.phoneNumber,
            group: group.groupName,
            year: group.year,
            status: 'active' as const,
            createdAt: s.createdOn,
            groupId: s.groupId,
          }));
        setStudents(filtered);

        // Fetch grades & absences for all students in group
        const results = await Promise.all(
          filtered.map(s => Promise.all([
            getGradesByStudentId(parseInt(s.id)),
            getAbsencesByStudentId(parseInt(s.id)),
          ]))
        );
        setGroupGrades(results.flatMap(([g]) => g));
        setGroupAbsences(results.flatMap(([, a]) => a));
      })
      .catch(console.error);
  }, [group]);

  useEffect(() => {
    if (!selectedStudent) return;
    setGrades([]);
    setAbsences([]);
    setFetching(true);
    const id = parseInt(selectedStudent.id);
    Promise.all([getGradesByStudentId(id), getAbsencesByStudentId(id)])
      .then(([g, a]) => { setGrades(g); setAbsences(a); })
      .catch(() => { setGrades([]); setAbsences([]); })
      .finally(() => setFetching(false));
  }, [selectedStudent?.id]);

  const handleSelectStudent = (student: UIStudent) => {
    setSelectedStudent(student);
    setActiveTab('note');
  };

  const handleBackToGroup = () => {
    setSelectedStudent(null);
  };

  const avg = grades.length > 0
    ? (grades.reduce((s, g) => s + g.gradeValue, 0) / grades.length).toFixed(1)
    : '—';

  const generateStudentReport = (s: UIStudent) => {
    const today = fmt(new Date().toISOString());
    const wb = XLSX.utils.book_new();
    const aoa: (string | number)[][] = [];
    aoa.push(['RAPORT STUDENT — ' + s.name]);
    aoa.push(['Student:', s.name, '', 'Email:', s.email]);
    aoa.push(['Grupă:', s.group, '', 'An studiu:', `Anul ${s.year}`]);
    aoa.push(['Data raport:', today]);
    aoa.push([]);
    aoa.push(['NOTE']);
    aoa.push(['#', 'Materie', 'Valoare', 'Data']);
    if (grades.length === 0) {
      aoa.push(['', 'Nu există note înregistrate', '', '']);
    } else {
      grades.forEach((g, i) => aoa.push([i + 1, g.subjectName, g.gradeValue, fmt(g.dateAwarded)]));
    }
    aoa.push(['', 'MEDIE:', avg, '']);
    aoa.push([]);
    aoa.push(['ABSENȚE']);
    aoa.push(['#', 'Materie', 'Data', 'Motivată']);
    if (absences.length === 0) {
      aoa.push(['', 'Nu există absențe înregistrate', '', '']);
    } else {
      absences.forEach((a, i) => aoa.push([i + 1, a.subjectName, fmt(a.date), a.isMotivated ? 'Da' : 'Nu']));
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 4 }, { wch: 24 }, { wch: 14 }, { wch: 18 }, { wch: 10 }];
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    XLSX.utils.book_append_sheet(wb, ws, 'Raport');
    XLSX.writeFile(wb, `raport_${s.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const sortedStudents = [...students].sort((a, b) =>
    sortMode === 'alpha' ? a.name.localeCompare(b.name, 'ro') : 0
  );

  return (
    <AnimatePresence>
      {group && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-[70] shadow-2xl flex flex-col overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {/* ── GROUP VIEW ── */}
              {!selectedStudent && (
                <motion.div
                  key="group-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                        <Users2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{group.groupName}</h2>
                        <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                          ANUL {group.year}
                        </span>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-6 pt-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Facultate</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{group.faculty || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Specializare</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{group.specialization || '—'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Coordinator</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{group.coordinator || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    {(() => {
                      const groupAvg = groupGrades.length > 0
                        ? (groupGrades.reduce((s, g) => s + g.gradeValue, 0) / groupGrades.length).toFixed(1)
                        : '—';
                      return (
                        <div className="grid grid-cols-3 gap-3 px-6 mt-5">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{groupAvg}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Medie Grupă</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{groupGrades.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Note</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
                            <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{groupAbsences.length}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Absențe Total</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Students list */}
                    <div className="px-6 mt-5 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          Studenți ({students.length})
                        </h3>
                        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                          <button
                            onClick={() => setSortMode('alpha')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              sortMode === 'alpha'
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                          >Alfabetic</button>
                          <button
                            onClick={() => setSortMode('avg')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              sortMode === 'avg'
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                          >Medie</button>
                        </div>
                      </div>

                      {students.length === 0 ? (
                        <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                          Niciun student în această grupă
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {sortedStudents.map((student) => (
                            <button
                              key={student.id}
                              onClick={() => handleSelectStudent(student)}
                              className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200 text-left"
                            >
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                                {getInitials(student.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => console.log('raport')}
                      className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm col-span-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Raport Grupă
                    </button>
                    <button
                      onClick={() => console.log('export')}
                      className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export Listă
                    </button>
                    <button
                      onClick={() => { onClose(); onEdit(group); }}
                      className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
                    >
                      <Pencil className="w-4 h-4" />
                      Editează Grupă
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STUDENT DETAIL VIEW ── */}
              {selectedStudent && (
                <motion.div
                  key="student-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleBackToGroup}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                        {getInitials(selectedStudent.name)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedStudent.name}</h2>
                        <span className="inline-block mt-0.5 px-3 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                          {selectedStudent.group}
                        </span>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 p-6 pb-0">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{avg}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Medie Generală</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{grades.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Note</p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{absences.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Absențe</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="mx-6 mt-5 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Informații Contact</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedStudent.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Telefon</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{selectedStudent.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 mt-5">
                      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                        {([
                          { id: 'note', label: `Note (${grades.length})` },
                          { id: 'absente', label: `Absențe (${absences.length})` },
                        ] as { id: Tab; label: string }[]).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2 pb-4">
                        {fetching && (
                          <div className="text-center py-8 text-gray-400 text-sm">Se încarcă...</div>
                        )}

                        {!fetching && activeTab === 'note' && grades.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">Nu există note înregistrate</div>
                        )}
                        {!fetching && activeTab === 'note' && grades.map((g) => (
                          <div key={g.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                              g.gradeValue >= 9 ? 'bg-green-500' : g.gradeValue >= 7 ? 'bg-emerald-500' : 'bg-orange-500'
                            }`}>
                              {g.gradeValue}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{g.subjectName}</p>
                            </div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">{fmtShort(g.dateAwarded)}</p>
                          </div>
                        ))}

                        {!fetching && activeTab === 'absente' && absences.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">Nu există absențe înregistrate</div>
                        )}
                        {!fetching && activeTab === 'absente' && absences.map((a) => (
                          <div key={a.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              a.isMotivated ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              <svg className={`w-5 h-5 ${a.isMotivated ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.isMotivated
                                  ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                  : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}
                                />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.subjectName}</p>
                              <p className={`text-xs font-medium ${a.isMotivated ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                {a.isMotivated ? 'Motivată' : 'Nemotivată'}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{fmtShort(a.date)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                    <button
                      onClick={handleBackToGroup}
                      className="flex items-center justify-center gap-2 flex-1 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Înapoi la Grupă
                    </button>
                    <button
                      onClick={() => generateStudentReport(selectedStudent)}
                      className="flex items-center justify-center gap-2 flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Generează Raport
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

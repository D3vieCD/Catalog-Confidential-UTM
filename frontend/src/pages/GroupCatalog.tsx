import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import useGroups from '../hooks/useGroups';
import useStudents from '../hooks/useStudents';
import useGrades from '../hooks/useGrades';
import useAbsences from '../hooks/useAbsences';
import useSubjects from '../hooks/useSubjects';
import type { Subject } from '../context/SubjectProvider';
import type { Group } from '../context/GroupProvider';
import type { Grade, CreateGradeDto, UpdateGradeDto } from '../context/GradeProvider';
import type { Absence, CreateAbsenceDto } from '../context/AbsenceProvider';
import type { Student } from '../context/StudentProvider';

export const GroupCatalog = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { getGroupById } = useGroups();
  const { getAllStudents } = useStudents();
  const { getGradesByStudentId, createGrade, updateGrade, deleteGrade } = useGrades();
  const { getAbsencesByStudentId, createAbsence, deleteAbsence } = useAbsences();
  const { getSubjectsByGroupId, createSubject, deleteSubject } = useSubjects();

  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradesMap, setGradesMap] = useState<Record<number, Grade[]>>({});
  const [absencesMap, setAbsencesMap] = useState<Record<number, Absence[]>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  const [notesHidden, setNotesHidden] = useState(false);
  const [selectedStudentRow, setSelectedStudentRow] = useState<number | null>(null);

  // Grade modal state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeModalStudentId, setGradeModalStudentId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState<number | null>(null);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);

  // Absence modal state
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceModalStudentId, setAbsenceModalStudentId] = useState<number | null>(null);
  const [absenceMotivated, setAbsenceMotivated] = useState(false);

  // Add subject modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Delete subject confirmation state
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState<number | null>(null);
  const [confirmDeleteSubjectName, setConfirmDeleteSubjectName] = useState('');

  const numericGroupId = groupId ? parseInt(groupId) : null;

  useEffect(() => {
    if (!numericGroupId) return;

    async function fetchAll() {
      setLoading(true);
      try {
        const [grp, allStudents, dbSubjects] = await Promise.all([
          getGroupById(numericGroupId!),
          getAllStudents(),
          getSubjectsByGroupId(numericGroupId!),
        ]);
        setGroup(grp);
        setSubjects(dbSubjects);
        if (dbSubjects.length > 0) setSelectedSubject(dbSubjects[0].subjectName);

        const groupStudents = allStudents.filter(s => s.groupId === numericGroupId);
        setStudents(groupStudents);

        const gradeResults = await Promise.all(
          groupStudents.map(s => getGradesByStudentId(s.id))
        );
        const absenceResults = await Promise.all(
          groupStudents.map(s => getAbsencesByStudentId(s.id))
        );

        const newGradesMap: Record<number, Grade[]> = {};
        const newAbsencesMap: Record<number, Absence[]> = {};
        groupStudents.forEach((s, i) => {
          newGradesMap[s.id] = gradeResults[i];
          newAbsencesMap[s.id] = absenceResults[i];
        });
        setGradesMap(newGradesMap);
        setAbsencesMap(newAbsencesMap);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [numericGroupId]);

  async function refreshGrades(studentId: number) {
    const grades = await getGradesByStudentId(studentId);
    setGradesMap(prev => ({ ...prev, [studentId]: grades }));
  }

  async function refreshAbsences(studentId: number) {
    const absences = await getAbsencesByStudentId(studentId);
    setAbsencesMap(prev => ({ ...prev, [studentId]: absences }));
  }

  const stats = useMemo(() => {
    const totalStudents = students.length;
    let totalGrades = 0;
    let gradeSum = 0;
    let totalAbsences = 0;

    students.forEach(s => {
      const sid = s.id;
      const grades = (gradesMap[sid] || []).filter(g => !selectedSubject || g.subjectName === selectedSubject);
      grades.forEach(g => { gradeSum += g.gradeValue; totalGrades++; });
      const absences = (absencesMap[sid] || []).filter(a => !selectedSubject || a.subjectName === selectedSubject);
      totalAbsences += absences.length;
    });

    return {
      totalStudents,
      groupAverage: totalGrades > 0 ? gradeSum / totalGrades : 0,
      totalAbsences,
    };
  }, [students, gradesMap, absencesMap, selectedSubject]);

  function handleOpenAddGrade(studentId: number) {
    setGradeModalStudentId(studentId);
    setGradeValue(null);
    setEditingGradeId(null);
    setShowGradeModal(true);
  }

  function handleOpenEditGrade(studentId: number, gradeId: number, currentValue: number) {
    setGradeModalStudentId(studentId);
    setGradeValue(currentValue);
    setEditingGradeId(gradeId);
    setShowGradeModal(true);
  }

  async function handleSaveGrade() {
    if (!gradeModalStudentId || gradeValue === null) return;

    if (editingGradeId !== null) {
      const dto: UpdateGradeDto = {
        subjectName: selectedSubject,
        gradeValue: gradeValue,
        dateAwarded: new Date().toISOString(),
      };
      await updateGrade(editingGradeId, dto);
    } else {
      const dto: CreateGradeDto = {
        studentId: gradeModalStudentId,
        subjectName: selectedSubject,
        gradeValue: gradeValue,
        dateAwarded: new Date().toISOString(),
      };
      await createGrade(dto);
    }

    await refreshGrades(gradeModalStudentId);
    setShowGradeModal(false);
    setGradeModalStudentId(null);
    setGradeValue(null);
    setEditingGradeId(null);
  }

  async function handleDeleteGrade() {
    if (editingGradeId === null || !gradeModalStudentId) return;
    await deleteGrade(editingGradeId);
    await refreshGrades(gradeModalStudentId);
    setShowGradeModal(false);
    setEditingGradeId(null);
  }

  function handleOpenAddAbsence(studentId: number) {
    setAbsenceModalStudentId(studentId);
    setAbsenceMotivated(false);
    setShowAbsenceModal(true);
  }

  async function handleSaveAbsence() {
    if (!absenceModalStudentId) return;
    const dto: CreateAbsenceDto = {
      studentId: absenceModalStudentId,
      subjectName: selectedSubject,
      date: new Date().toISOString(),
      isMotivated: absenceMotivated,
    };
    await createAbsence(dto);
    await refreshAbsences(absenceModalStudentId);
    setShowAbsenceModal(false);
    setAbsenceModalStudentId(null);
  }

  async function handleDeleteAbsence(absenceId: number, studentId: number) {
    await deleteAbsence(absenceId);
    await refreshAbsences(studentId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Grupa nu a fost găsită</p>
          <button
            onClick={() => navigate('/dashboard/catalog')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
          >
            Înapoi la Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/catalog')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-gray-800 hover:bg-emerald-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-emerald-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Catalog {group.groupName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {students.length} studenți
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dropdown Materie */}
          <SubjectDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={subjects.map(s => ({ value: s.subjectName, label: s.subjectName, id: s.id }))}
            onAddSubject={() => { setNewSubjectName(''); setShowSubjectModal(true); }}
            onDeleteSubject={(subjectId, subjectName) => {
              setConfirmDeleteSubjectId(subjectId);
              setConfirmDeleteSubjectName(subjectName);
            }}
            placeholder={subjects.length === 0 ? 'Nicio materie' : undefined}
          />

          {/* Buton Ascunde Notele */}
          <button
            onClick={() => { setNotesHidden(!notesHidden); setSelectedStudentRow(null); }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-md ${
              notesHidden
                ? 'border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notesHidden
                ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}
              />
            </svg>
            {notesHidden ? 'Notele sunt Ascunse' : 'Ascunde Notele'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-stone-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Studenți</p>
              <p className="text-4xl font-bold text-stone-900 dark:text-white">{stats.totalStudents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <p className="text-stone-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Medie Grupă</p>
              <p className="text-4xl font-bold text-stone-900 dark:text-white">{stats.groupAverage.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-stone-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide">Absențe Totale</p>
              <p className="text-4xl font-bold text-stone-900 dark:text-white">{stats.totalAbsences}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabel Studenți */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Note</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Medie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Absențe</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => {
                const sid = student.id;
                const studentGrades = (gradesMap[sid] || []).filter(g => !selectedSubject || g.subjectName === selectedSubject);
                const studentAbsences = (absencesMap[sid] || []).filter(a => !selectedSubject || a.subjectName === selectedSubject);
                const average = studentGrades.length > 0
                  ? studentGrades.reduce((sum, g) => sum + g.gradeValue, 0) / studentGrades.length
                  : 0;
                const isRowVisible = selectedStudentRow === sid;

                return (
                  <tr
                    key={student.id}
                    onClick={() => { if (notesHidden) setSelectedStudentRow(isRowVisible ? null : sid); }}
                    className={`group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${notesHidden && !isRowVisible ? 'cursor-pointer' : ''}`}
                  >
                    {/* Student */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.fullName.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{student.fullName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Note */}
                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <div className="flex items-center gap-3 flex-wrap">
                        {studentGrades.map((grade) => {
                          const dateStr = new Date(grade.dateAwarded).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
                          return (
                            <div key={grade.id} className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{dateStr}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenEditGrade(sid, grade.id, grade.gradeValue); }}
                                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 text-white text-base font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer"
                                title="Click pentru a edita nota"
                              >
                                {grade.gradeValue}
                              </button>
                            </div>
                          );
                        })}
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs text-transparent select-none">—</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenAddGrade(sid); }}
                            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-400 flex items-center justify-center text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Medie */}
                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <span className={`text-lg font-bold ${average === 0 ? 'text-gray-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {average > 0 ? average.toFixed(2) : '-'}
                      </span>
                    </td>

                    {/* Absențe */}
                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          studentAbsences.length === 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {studentAbsences.length}
                        </span>
                        {studentAbsences.map(abs => (
                          <span
                            key={abs.id}
                            onClick={(e) => { e.stopPropagation(); handleDeleteAbsence(abs.id, sid); }}
                            className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer hover:opacity-75 transition-opacity ${
                              abs.isMotivated
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}
                            title={`${abs.isMotivated ? 'Motivată' : 'Nemotivată'} - ${new Date(abs.date).toLocaleDateString('ro-RO')} (click pentru ștergere)`}
                          >
                            {abs.isMotivated ? 'M' : 'N'}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Acțiuni */}
                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenAddGrade(sid); }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                          Adaugă Notă
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenAddAbsence(sid); }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                          Absență
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adăugare/Editare Notă */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => { setShowGradeModal(false); setEditingGradeId(null); }}
        title={editingGradeId !== null ? "Editează Notă" : "Adaugă Notă"}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Materia: <span className="font-semibold text-gray-900 dark:text-white">{selectedSubject || 'Necunoscută'}</span>
          </p>

          {/* Input materie dacă nu există nicio materie */}
          {subjects.length === 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Nume Materie
              </label>
              <input
                type="text"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                placeholder="ex: Matematică"
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Selectează Nota
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGradeValue(num)}
                  className={`py-3 rounded-xl font-bold transition-all duration-200 ${
                    gradeValue === num
                      ? 'bg-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {editingGradeId !== null && (
              <button
                onClick={handleDeleteGrade}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-colors"
              >
                Șterge
              </button>
            )}
            <button
              onClick={() => { setShowGradeModal(false); setEditingGradeId(null); }}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleSaveGrade}
              disabled={gradeValue === null || !selectedSubject}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-lg"
            >
              Salvează
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmare Ștergere Materie */}
      <ConfirmModal
        isOpen={confirmDeleteSubjectId !== null}
        onClose={() => setConfirmDeleteSubjectId(null)}
        onConfirm={async () => {
          if (confirmDeleteSubjectId === null) return;
          await deleteSubject(confirmDeleteSubjectId);
          setSubjects(prev => {
            const updated = prev.filter(s => s.id !== confirmDeleteSubjectId);
            setSelectedSubject(updated.length > 0 ? updated[0].subjectName : '');
            return updated;
          });
          setConfirmDeleteSubjectId(null);
        }}
        title="Șterge Materia"
        message={`Ești sigur că vrei să ștergi materia "${confirmDeleteSubjectName}"? Această acțiune nu poate fi anulată.`}
        confirmText="Șterge"
        cancelText="Anulează"
      />

      {/* Modal Adăugare Materie Nouă */}
      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title="Adaugă Materie Nouă"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Nume Materie
            </label>
            <input
              type="text"
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  (e.currentTarget.nextElementSibling as HTMLElement | null)?.querySelector('button:last-child')?.click();
                }
              }}
              placeholder="ex: Matematică, Informatică..."
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowSubjectModal(false)}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors"
            >
              Anulează
            </button>
            <button
              disabled={!newSubjectName.trim()}
              onClick={async () => {
                const trimmed = newSubjectName.trim();
                if (!numericGroupId) return;
                const already = subjects.find(s => s.subjectName === trimmed);
                if (!already) {
                  const saved = await createSubject({ groupId: numericGroupId, subjectName: trimmed });
                  setSubjects(prev => [...prev, saved]);
                  setSelectedSubject(saved.subjectName);
                } else {
                  setSelectedSubject(already.subjectName);
                }
                setShowSubjectModal(false);
              }}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-lg"
            >
              Adaugă
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Adăugare Absență */}
      <Modal
        isOpen={showAbsenceModal}
        onClose={() => setShowAbsenceModal(false)}
        title="Adaugă Absență"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Materia: <span className="font-semibold text-gray-900 dark:text-white">{selectedSubject || 'Necunoscută'}</span>
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Tip Absență
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAbsenceMotivated(false)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                  !absenceMotivated
                    ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 shadow-sm scale-105'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-red-300 dark:hover:border-red-700'
                }`}
              >
                Nemotivată
              </button>
              <button
                type="button"
                onClick={() => setAbsenceMotivated(true)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                  absenceMotivated
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm scale-105'
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                Motivată
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAbsenceModal(false)}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleSaveAbsence}
              disabled={!selectedSubject}
              className="flex-1 px-6 py-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 font-semibold rounded-2xl transition-all"
            >
              Adaugă
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Subject Dropdown Component
interface DropdownOption { value: string; label: string; id: number; }

const SubjectDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  onAddSubject: () => void;
  onDeleteSubject: (subjectId: number, subjectName: string) => void;
  placeholder?: string;
}> = ({ value, onChange, options, onAddSubject, onDeleteSubject, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px]"
      >
        <span className="text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </span>
        <span className="flex-1 text-left">{selectedOption?.label || placeholder || 'Selectează materia'}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-20"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center group/item transition-colors duration-150 ${
                    option.value === value
                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                    className={`flex-1 px-4 py-2.5 text-left text-sm ${
                      option.value === value
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDeleteSubject(option.id, option.label); setIsOpen(false); }}
                    className="px-2 py-2.5 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                    title="Șterge materia"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
              {options.length > 0 && <div className="border-t border-gray-100 dark:border-gray-700" />}
              <button
                type="button"
                onClick={() => { setIsOpen(false); onAddSubject(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-150 flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Adaugă materie nouă
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

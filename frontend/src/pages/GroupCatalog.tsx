import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroupById } from '../_mock/mockGroups';
import { getStudents } from '../_mock/mockStudents';
import {
  getStudentGrades,
  getStudentAbsences,
  calculateAverage,
  getGroupSubjectStats,
  addGrade,
  updateGrade,
  deleteGrade,
  type GradeFormData,
} from '../_mock/mockGrades';
import { Modal } from '../components/ui/Modal';

/**
 * GroupCatalog - Catalogul unei grupe cu note și absențe
 */
export const GroupCatalog = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const group = useMemo(() => getGroupById(groupId || ''), [groupId]);
  const students = useMemo(() => {
    if (!group) return [];
    return getStudents().filter(s => s.group === group.name && s.status === 'active');
  }, [group]);

  const [selectedSubject, setSelectedSubject] = useState(group?.subjects[0] || '');
  const [notesHidden, setNotesHidden] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Pentru a forța re-render
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null); // Pentru editare notă
  const [selectedStudentRow, setSelectedStudentRow] = useState<string | null>(null); // Pentru deblurare la click
  // Calculează statistici
  const stats = useMemo(() => {
    if (!group || !selectedSubject) return { totalStudents: 0, groupAverage: 0, totalAbsences: 0 };
    return getGroupSubjectStats(group.id, selectedSubject, students.map(s => s.id));
  }, [group, selectedSubject, students, refreshKey]);

  // Navighează înapoi
  const handleBack = () => {
    navigate('/dashboard/catalog');
  };

  // Deschide modal pentru adăugare notă
  const handleAddGrade = (studentId: string) => {
    setSelectedStudent(studentId);
    setGradeValue(null);
    setEditingGradeId(null);
    setShowGradeModal(true);
  };

  // Deschide modal pentru editare notă
  const handleEditGrade = (studentId: string, gradeId: string, currentValue: number | null) => {
    setSelectedStudent(studentId);
    setGradeValue(currentValue);
    setEditingGradeId(gradeId);
    setShowGradeModal(true);
  };

  // Salvează nota (adaugă sau editează)
  const handleSaveGrade = () => {
    if (!selectedStudent || !group) return;

    if (editingGradeId) {
      // Editare notă existentă
      updateGrade(editingGradeId, gradeValue);
    } else {
      // Adăugare notă nouă
      const data: GradeFormData = {
        value: gradeValue,
        subject: selectedSubject,
      };
      addGrade(selectedStudent, group.id, data);
    }

    setShowGradeModal(false);
    setSelectedStudent(null);
    setGradeValue(null);
    setEditingGradeId(null);

    // Force re-render fără reload
    setRefreshKey(prev => prev + 1);
  };
if (!group) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Grupa nu a fost găsită</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
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
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-100 dark:bg-gray-800 hover:bg-cyan-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-cyan-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Catalog {group.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {students.length} studenți activi
            </p>
          </div>
        </div>

        {/* Dropdown Materie + Buton Ascunde */}
        <div className="flex items-center gap-3">
          <CustomDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={group.subjects.map(s => ({ value: s, label: s }))}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            }
          />

          <button
            onClick={() => {
              setNotesHidden(!notesHidden);
              setSelectedStudentRow(null); 
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-md ${
              notesHidden
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg'
                : 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notesHidden ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}/>
            </svg>
            {notesHidden ? 'Notele sunt Ascunse' : 'Ascunde Notele'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Studenți</p>
              <p className="text-4xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Medie Grupă</p>
              <p className="text-4xl font-bold">{stats.groupAverage.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-pink-400 to-pink-500 dark:from-red-500 dark:to-pink-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Absențe Totale</p>
              <p className="text-4xl font-bold">{stats.totalAbsences}</p>
            </div>
          </div>
        </motion.div>
      </div>

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
                const grades = getStudentGrades(student.id, selectedSubject);
                const average = calculateAverage(student.id, selectedSubject);
                const absences = getStudentAbsences(student.id, selectedSubject);
                const isRowVisible = selectedStudentRow === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => {
                      if (notesHidden) setSelectedStudentRow(isRowVisible ? null : student.id);
                    }}
                    className={`group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      notesHidden && !isRowVisible ? 'cursor-pointer' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        {grades.map((grade) => (
                          <button
                            key={grade.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGrade(student.id, grade.id, grade.value);
                            }}
                            className={`w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-base font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-600 ${
                              grade.value === null ? 'text-gray-400' : grade.value >= 9 ? 'text-emerald-600' : grade.value >= 7 ? 'text-sky-600' : 'text-rose-600'
                            }`}
                          >
                            {grade.value ?? '-'}
                          </button>
                        ))}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddGrade(student.id); }}
                          className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                        </button>
                      </div>
                    </td>

                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <span className={`text-lg font-bold ${average === 0 ? 'text-gray-400' : average >= 9 ? 'text-green-600' : 'text-blue-600'}`}>
                        {average > 0 ? average.toFixed(2) : '-'}
                      </span>
                    </td>

                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                        {absences.length}
                      </span>
                    </td>

                    <td className={`px-6 py-4 transition-all ${notesHidden && !isRowVisible ? 'blur-sm' : ''}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddGrade(student.id); }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors text-sm"
                      >
                        Adaugă Notă
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
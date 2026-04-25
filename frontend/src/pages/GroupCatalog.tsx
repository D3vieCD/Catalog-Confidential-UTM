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
import useEvaluations from '../hooks/useEvaluations';
import type { Subject } from '../context/SubjectProvider';
import type { Group } from '../context/GroupProvider';
import type { Grade, CreateGradeDto, UpdateGradeDto } from '../context/GradeProvider';
import type { Absence, CreateAbsenceDto } from '../context/AbsenceProvider';
import type { Student } from '../context/StudentProvider';
import type { Evaluation } from '../context/EvaluationProvider';

const EVAL_TYPES = ['Temă', 'Test', 'Examen', 'Oral'];

const EVAL_TYPE_COLORS: Record<string, string> = {
  'Temă': 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  'Test': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Examen': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Oral': 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
};

function gradeColor(value: number): string {
  if (value >= 8) return 'bg-emerald-600 hover:bg-emerald-700 text-white';
  if (value >= 5) return 'bg-amber-500 hover:bg-amber-600 text-white';
  return 'bg-red-500 hover:bg-red-600 text-white';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
}

export const GroupCatalog = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { getGroupById } = useGroups();
  const { getAllStudents } = useStudents();
  const { getGradesByStudentId, createGrade, updateGrade, deleteGrade } = useGrades();
  const { getAbsencesByStudentId, createAbsence, deleteAbsence } = useAbsences();
  const { getSubjectsByGroupId, createSubject, deleteSubject } = useSubjects();
  const { getEvaluationsBySubjectId, createEvaluation, updateEvaluation, deleteEvaluation } = useEvaluations();

  const [group, setGroup] = useState<Group | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradesMap, setGradesMap] = useState<Record<number, Grade[]>>({});
  const [absencesMap, setAbsencesMap] = useState<Record<number, Absence[]>>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesHidden, setNotesHidden] = useState(false);
  const [selectedStudentRow, setSelectedStudentRow] = useState<number | null>(null);

  // Grade modal
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeModalStudentId, setGradeModalStudentId] = useState<number | null>(null);
  const [gradeEvalId, setGradeEvalId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState<number | null>(null);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);

  // Absence modal
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceModalStudentId, setAbsenceModalStudentId] = useState<number | null>(null);
  const [absenceEvalId, setAbsenceEvalId] = useState<number | null>(null);
  const [absenceMotivated, setAbsenceMotivated] = useState(false);

  // Evaluation create/edit modal
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [editingEvalId, setEditingEvalId] = useState<number | null>(null);
  const [evalName, setEvalName] = useState('');
  const [evalType, setEvalType] = useState('Temă');
  const [evalDate, setEvalDate] = useState(new Date().toISOString().slice(0, 10));

  // Delete evaluation confirmation
  const [confirmDeleteEvalId, setConfirmDeleteEvalId] = useState<number | null>(null);
  const [confirmDeleteEvalName, setConfirmDeleteEvalName] = useState('');

  // Subject modal
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState<number | null>(null);
  const [confirmDeleteSubjectName, setConfirmDeleteSubjectName] = useState('');

  const numericGroupId = groupId ? parseInt(groupId) : null;
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) ?? null;

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
        if (dbSubjects.length > 0) setSelectedSubjectId(dbSubjects[0].id);

        const groupStudents = allStudents.filter(s => s.groupId === numericGroupId);
        setStudents(groupStudents);

        const gradeResults = await Promise.all(groupStudents.map(s => getGradesByStudentId(s.id)));
        const absenceResults = await Promise.all(groupStudents.map(s => getAbsencesByStudentId(s.id)));

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

  useEffect(() => {
    if (!selectedSubjectId) { setEvaluations([]); return; }
    getEvaluationsBySubjectId(selectedSubjectId)
      .then(evs => setEvaluations([...evs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())))
      .catch(() => setEvaluations([]));
  }, [selectedSubjectId]);

  async function refreshGrades(studentId: number) {
    const grades = await getGradesByStudentId(studentId);
    setGradesMap(prev => ({ ...prev, [studentId]: grades }));
  }

  async function refreshAbsences(studentId: number) {
    const absences = await getAbsencesByStudentId(studentId);
    setAbsencesMap(prev => ({ ...prev, [studentId]: absences }));
  }

  const stats = useMemo(() => {
    const evalIds = new Set(evaluations.map(e => e.id));
    let totalGrades = 0;
    let gradeSum = 0;
    let totalAbsences = 0;

    students.forEach(s => {
      const sid = s.id;
      (gradesMap[sid] || []).filter(g => g.evaluationId != null && evalIds.has(g.evaluationId!)).forEach(g => {
        gradeSum += g.gradeValue;
        totalGrades++;
      });
      totalAbsences += (absencesMap[sid] || []).filter(a => a.evaluationId != null && evalIds.has(a.evaluationId!)).length;
    });

    return {
      totalStudents: students.length,
      groupAverage: totalGrades > 0 ? gradeSum / totalGrades : 0,
      totalAbsences,
    };
  }, [students, gradesMap, absencesMap, evaluations]);

  // Grade handlers
  function handleOpenAddGrade(studentId: number, evalId: number) {
    setGradeModalStudentId(studentId);
    setGradeEvalId(evalId);
    setGradeValue(null);
    setEditingGradeId(null);
    setShowGradeModal(true);
  }

  function handleOpenEditGrade(studentId: number, gradeId: number, currentValue: number, evalId: number | undefined) {
    setGradeModalStudentId(studentId);
    setGradeValue(currentValue);
    setEditingGradeId(gradeId);
    setGradeEvalId(evalId ?? null);
    setShowGradeModal(true);
  }

  async function handleSaveGrade() {
    if (!gradeModalStudentId || gradeValue === null || !selectedSubject) return;

    if (editingGradeId !== null) {
      const dto: UpdateGradeDto = {
        subjectName: selectedSubject.subjectName,
        gradeValue,
        dateAwarded: new Date().toISOString(),
        evaluationId: gradeEvalId ?? undefined,
      };
      await updateGrade(editingGradeId, dto);
    } else {
      const dto: CreateGradeDto = {
        studentId: gradeModalStudentId,
        subjectName: selectedSubject.subjectName,
        gradeValue,
        dateAwarded: new Date().toISOString(),
        evaluationId: gradeEvalId ?? undefined,
      };
      await createGrade(dto);
    }

    await refreshGrades(gradeModalStudentId);
    setShowGradeModal(false);
    setGradeModalStudentId(null);
    setGradeValue(null);
    setEditingGradeId(null);
    setGradeEvalId(null);
  }

  async function handleDeleteGrade() {
    if (editingGradeId === null || !gradeModalStudentId) return;
    await deleteGrade(editingGradeId);
    await refreshGrades(gradeModalStudentId);
    setShowGradeModal(false);
    setEditingGradeId(null);
    setGradeEvalId(null);
  }

  // Absence handlers
  function handleOpenAddAbsence(studentId: number, evalId: number) {
    setAbsenceModalStudentId(studentId);
    setAbsenceEvalId(evalId);
    setAbsenceMotivated(false);
    setShowAbsenceModal(true);
  }

  async function handleSaveAbsence() {
    if (!absenceModalStudentId || !selectedSubject) return;
    const dto: CreateAbsenceDto = {
      studentId: absenceModalStudentId,
      subjectName: selectedSubject.subjectName,
      date: new Date().toISOString(),
      isMotivated: absenceMotivated,
      evaluationId: absenceEvalId ?? undefined,
    };
    await createAbsence(dto);
    await refreshAbsences(absenceModalStudentId);
    setShowAbsenceModal(false);
    setAbsenceModalStudentId(null);
    setAbsenceEvalId(null);
  }

  async function handleDeleteAbsence(absenceId: number, studentId: number) {
    await deleteAbsence(absenceId);
    await refreshAbsences(studentId);
  }

  // Evaluation handlers
  function handleOpenAddEval() {
    setEditingEvalId(null);
    setEvalName('');
    setEvalType('Temă');
    setEvalDate(new Date().toISOString().slice(0, 10));
    setShowEvalModal(true);
  }

  function handleOpenEditEval(ev: Evaluation) {
    setEditingEvalId(ev.id);
    setEvalName(ev.name);
    setEvalType(ev.type);
    setEvalDate(ev.date.slice(0, 10));
    setShowEvalModal(true);
  }

  async function handleSaveEval() {
    if (!evalName.trim() || !selectedSubjectId) return;
    const isoDate = new Date(evalDate).toISOString();
    if (editingEvalId !== null) {
      const updated = await updateEvaluation(editingEvalId, { name: evalName.trim(), type: evalType, date: isoDate });
      setEvaluations(prev => [...prev.map(e => e.id === editingEvalId ? updated : e)].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } else {
      const created = await createEvaluation({ subjectId: selectedSubjectId, name: evalName.trim(), type: evalType, date: isoDate });
      setEvaluations(prev => [...prev, created].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
    setShowEvalModal(false);
  }

  async function handleDeleteEval() {
    if (confirmDeleteEvalId === null) return;
    await deleteEvaluation(confirmDeleteEvalId);
    setEvaluations(prev => prev.filter(e => e.id !== confirmDeleteEvalId));
    setConfirmDeleteEvalId(null);
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4"
      >
        {/* Back + Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/dashboard/catalog')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-gray-700 hover:bg-emerald-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-700 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Catalog {group.groupName}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{students.length} studenți</p>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 flex-shrink-0" />

        {/* Stat Cards */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">Studenți</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">Medie Grupă</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stats.groupAverage.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">Absențe Totale</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stats.totalAbsences}</p>
            </div>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 flex-shrink-0" />

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SubjectDropdown
            value={selectedSubjectId}
            onChange={setSelectedSubjectId}
            options={subjects.map(s => ({ value: s.id, label: s.subjectName }))}
            onAddSubject={() => { setNewSubjectName(''); setShowSubjectModal(true); }}
            onDeleteSubject={(subjectId, subjectName) => {
              setConfirmDeleteSubjectId(subjectId);
              setConfirmDeleteSubjectName(subjectName);
            }}
            placeholder={subjects.length === 0 ? 'Nicio materie' : undefined}
          />
          <button
            onClick={handleOpenAddEval}
            disabled={!selectedSubjectId}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            title={!selectedSubjectId ? 'Selectează o materie mai întâi' : 'Adaugă evaluare nouă'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Evaluare
          </button>
          <button
            onClick={() => { setNotesHidden(!notesHidden); setSelectedStudentRow(null); }}
            className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
              notesHidden
                ? 'border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notesHidden
                ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"}
              />
            </svg>
            {notesHidden ? 'Ascunse' : 'Ascunde'}
          </button>
        </div>
      </motion.div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {/* Student column — sticky */}
                <th className="sticky left-0 z-20 bg-gray-50 dark:bg-gray-900 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[220px] border-r border-gray-200 dark:border-gray-700">
                  Student
                </th>

                {/* Evaluation columns */}
                {evaluations.length === 0 && (
                  <th className="px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-500 font-normal" colSpan={3}>
                    {selectedSubjectId
                      ? 'Nicio evaluare adăugată — apasă "+ Evaluare" pentru a începe'
                      : 'Selectează o materie din meniu'}
                  </th>
                )}
                {evaluations.map(ev => (
                  <th
                    key={ev.id}
                    className="px-2 py-3 text-center min-w-[100px] max-w-[100px] border-l border-gray-100 dark:border-gray-700/60"
                  >
                    <div className="group/col flex flex-col items-center gap-1 relative">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${EVAL_TYPE_COLORS[ev.type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ev.type}
                      </span>
                      <span
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-20 text-center block"
                        title={ev.name}
                      >
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(ev.date)}</span>
                      <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity mt-0.5">
                        <button
                          onClick={() => handleOpenEditEval(ev)}
                          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          title="Editează evaluarea"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => { setConfirmDeleteEvalId(ev.id); setConfirmDeleteEvalName(ev.name); }}
                          className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          title="Șterge evaluarea"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Summary columns */}
                {evaluations.length > 0 && (
                  <>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[80px] border-l border-gray-200 dark:border-gray-700">
                      Medie
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[90px] border-l border-gray-200 dark:border-gray-700">
                      Absențe
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.map(student => {
                const sid = student.id;
                const isRowVisible = selectedStudentRow === sid;
                const evalIds = new Set(evaluations.map(e => e.id));
                const studentGradesForSubject = (gradesMap[sid] || []).filter(g => g.evaluationId != null && evalIds.has(g.evaluationId!));
                const studentAbsencesForSubject = (absencesMap[sid] || []).filter(a => a.evaluationId != null && evalIds.has(a.evaluationId!));
                const average = studentGradesForSubject.length > 0
                  ? studentGradesForSubject.reduce((sum, g) => sum + g.gradeValue, 0) / studentGradesForSubject.length
                  : 0;

                return (
                  <tr
                    key={sid}
                    onClick={() => { if (notesHidden) setSelectedStudentRow(isRowVisible ? null : sid); }}
                    className={`group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${notesHidden && !isRowVisible ? 'cursor-pointer' : ''}`}
                  >
                    {/* Student — sticky */}
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/30 px-6 py-4 border-r border-gray-200 dark:border-gray-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {student.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{student.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Evaluation cells */}
                    {evaluations.map(ev => {
                      const cellGrade = (gradesMap[sid] || []).find(g => g.evaluationId === ev.id);
                      const cellAbsence = (absencesMap[sid] || []).find(a => a.evaluationId === ev.id);
                      const hasContent = cellGrade || cellAbsence;

                      return (
                        <td
                          key={ev.id}
                          className={`px-2 py-4 text-center border-l border-gray-100 dark:border-gray-700/60 transition-all ${notesHidden && !isRowVisible ? 'blur-sm select-none' : ''}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {cellGrade && (
                              <button
                                onClick={e => { e.stopPropagation(); handleOpenEditGrade(sid, cellGrade.id, cellGrade.gradeValue, cellGrade.evaluationId); }}
                                className={`w-9 h-9 rounded-full text-sm font-extrabold shadow-sm hover:shadow-md transition-all cursor-pointer ${gradeColor(cellGrade.gradeValue)}`}
                                title={`Nota ${cellGrade.gradeValue} — click pentru editare`}
                              >
                                {cellGrade.gradeValue}
                              </button>
                            )}
                            {cellAbsence && (
                              <button
                                onClick={e => { e.stopPropagation(); handleDeleteAbsence(cellAbsence.id, sid); }}
                                className={`px-2 py-0.5 rounded-md text-xs font-bold cursor-pointer hover:opacity-70 transition-opacity ${
                                  cellAbsence.isMotivated
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                }`}
                                title={`Absență ${cellAbsence.isMotivated ? 'motivată' : 'nemotivată'} — click pentru ștergere`}
                              >
                                {cellAbsence.isMotivated ? 'M' : 'A'}
                              </button>
                            )}
                            {!hasContent && (
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={e => { e.stopPropagation(); handleOpenAddGrade(sid, ev.id); }}
                                  className="w-7 h-7 rounded-full border border-dashed border-emerald-400 dark:border-emerald-600 flex items-center justify-center text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-125 hover:border-solid hover:shadow-sm transition-all duration-200"
                                  title="Adaugă notă"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                                  </svg>
                                </button>
                                <button
                                  onClick={e => { e.stopPropagation(); handleOpenAddAbsence(sid, ev.id); }}
                                  className="w-7 h-7 rounded-full border border-dashed border-red-300 dark:border-red-700 flex items-center justify-center text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-125 hover:border-solid hover:shadow-sm transition-all duration-200 text-[10px] font-bold"
                                  title="Adaugă absență"
                                >
                                  A
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Summary cells */}
                    {evaluations.length > 0 && (
                      <>
                        <td className={`px-4 py-4 text-center border-l border-gray-200 dark:border-gray-700 transition-all ${notesHidden && !isRowVisible ? 'blur-sm select-none' : ''}`}>
                          <span className={`text-base font-bold ${average === 0 ? 'text-gray-400' : average >= 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                            {average > 0 ? average.toFixed(2) : '—'}
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-center border-l border-gray-200 dark:border-gray-700 transition-all ${notesHidden && !isRowVisible ? 'blur-sm select-none' : ''}`}>
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                            studentAbsencesForSubject.length === 0
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {studentAbsencesForSubject.length}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td colSpan={evaluations.length + 3} className="px-6 py-16 text-center text-gray-400 dark:text-gray-500">
                    Niciun student în această grupă
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adaugă / Editează Evaluare */}
      <Modal
        isOpen={showEvalModal}
        onClose={() => setShowEvalModal(false)}
        title={editingEvalId !== null ? 'Editează Evaluarea' : 'Adaugă Evaluare Nouă'}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Denumire
            </label>
            <input
              type="text"
              value={evalName}
              onChange={e => setEvalName(e.target.value)}
              placeholder="ex: Tema 1, Test capitolul 3..."
              autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Tip Evaluare
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVAL_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEvalType(t)}
                  className={`py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                    evalType === t
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-sm scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Data
            </label>
            <input
              type="date"
              value={evalDate}
              onChange={e => setEvalDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowEvalModal(false)}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleSaveEval}
              disabled={!evalName.trim()}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-all shadow-lg"
            >
              {editingEvalId !== null ? 'Salvează' : 'Adaugă'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmare ștergere evaluare */}
      <ConfirmModal
        isOpen={confirmDeleteEvalId !== null}
        onClose={() => setConfirmDeleteEvalId(null)}
        onConfirm={handleDeleteEval}
        title="Șterge Evaluarea"
        message={`Ești sigur că vrei să ștergi evaluarea "${confirmDeleteEvalName}"? Toate notele și absențele asociate vor fi șterse.`}
        confirmText="Șterge"
        cancelText="Anulează"
      />

      {/* Modal Adăugare / Editare Notă */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => { setShowGradeModal(false); setEditingGradeId(null); setGradeEvalId(null); }}
        title={editingGradeId !== null ? 'Editează Nota' : 'Adaugă Notă'}
        size="sm"
      >
        <div className="space-y-4">
          {gradeEvalId && (
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Evaluare</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {evaluations.find(e => e.id === gradeEvalId)?.name ?? '—'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Selectează Nota
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
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

          <div className="flex gap-3 pt-2">
            {editingGradeId !== null && (
              <button
                onClick={handleDeleteGrade}
                className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-colors"
              >
                Șterge
              </button>
            )}
            <button
              onClick={() => { setShowGradeModal(false); setEditingGradeId(null); setGradeEvalId(null); }}
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

      {/* Modal Adăugare Absență */}
      <Modal
        isOpen={showAbsenceModal}
        onClose={() => { setShowAbsenceModal(false); setAbsenceEvalId(null); }}
        title="Adaugă Absență"
        size="sm"
      >
        <div className="space-y-4">
          {absenceEvalId && (
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">Evaluare</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {evaluations.find(e => e.id === absenceEvalId)?.name ?? '—'}
              </p>
            </div>
          )}

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
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-red-300'
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
                    : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-blue-300'
                }`}
              >
                Motivată
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAbsenceModal(false); setAbsenceEvalId(null); }}
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

      {/* Modal Adăugare Materie */}
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
                  setSelectedSubjectId(saved.id);
                } else {
                  setSelectedSubjectId(already.id);
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

      {/* Confirmare ștergere materie */}
      <ConfirmModal
        isOpen={confirmDeleteSubjectId !== null}
        onClose={() => setConfirmDeleteSubjectId(null)}
        onConfirm={async () => {
          if (confirmDeleteSubjectId === null) return;
          await deleteSubject(confirmDeleteSubjectId);
          setSubjects(prev => {
            const updated = prev.filter(s => s.id !== confirmDeleteSubjectId);
            setSelectedSubjectId(updated.length > 0 ? updated[0].id : null);
            return updated;
          });
          setConfirmDeleteSubjectId(null);
        }}
        title="Șterge Materia"
        message={`Ești sigur că vrei să ștergi materia "${confirmDeleteSubjectName}"? Această acțiune nu poate fi anulată.`}
        confirmText="Șterge"
        cancelText="Anulează"
      />
    </div>
  );
};

// Subject Dropdown Component
interface SubjectDropdownOption { value: number; label: string; }

const SubjectDropdown: React.FC<{
  value: number | null;
  onChange: (value: number) => void;
  options: SubjectDropdownOption[];
  onAddSubject: () => void;
  onDeleteSubject: (subjectId: number, subjectName: string) => void;
  placeholder?: string;
}> = ({ value, onChange, options, onAddSubject, onDeleteSubject, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[180px]"
      >
        <span className="text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </span>
        <span className="flex-1 text-left truncate">{selectedOption?.label ?? placeholder ?? 'Selectează materia'}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden z-20 min-w-[180px]"
            >
              {options.map(option => (
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
                    onClick={e => { e.stopPropagation(); onDeleteSubject(option.value, option.label); setIsOpen(false); }}
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
                className="w-full px-4 py-2.5 text-left text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-2 font-medium"
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

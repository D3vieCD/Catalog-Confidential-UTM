/**
 * Mock data și helpers pentru Note și Absențe
 */

export interface Grade {
  id: string;
  studentId: string;
  groupId: string;
  subject: string;
  value: number | null; // 1-10 sau null pentru "lipsă"
  date: string;
}

export interface Absence {
  id: string;
  studentId: string;
  groupId: string;
  subject: string;
  date: string;
  motivated: boolean;
}

export interface GradeFormData {
  value: number | null;
  subject: string;
}

const STORAGE_KEYS = {
  grades: 'academix_grades',
  absences: 'academix_absences',
} as const;

// Note inițiale - DATE DEMO COMPLETE pentru testare Catalog
const INITIAL_GRADES: Grade[] = [
  // Andrei Munteanu (id: 1) - INF-211 - Informatică Aplicată
  { id: '1', studentId: '1', groupId: '1', subject: 'Informatică Aplicată', value: 9, date: new Date('2025-10-01').toISOString() },
  { id: '2', studentId: '1', groupId: '1', subject: 'Informatică Aplicată', value: 8, date: new Date('2025-10-05').toISOString() },
  { id: '3', studentId: '1', groupId: '1', subject: 'Informatică Aplicată', value: 10, date: new Date('2025-10-12').toISOString() },

  // Andrei Munteanu - Informatică
  { id: '4', studentId: '1', groupId: '1', subject: 'Informatică', value: 7, date: new Date('2025-10-03').toISOString() },
  { id: '5', studentId: '1', groupId: '1', subject: 'Informatică', value: 8, date: new Date('2025-10-10').toISOString() },
  { id: '6', studentId: '1', groupId: '1', subject: 'Informatică', value: 9, date: new Date('2025-10-15').toISOString() },

  // Elena Popa (id: 3) - INF-211 - Informatică Aplicată
  { id: '7', studentId: '3', groupId: '1', subject: 'Informatică Aplicată', value: 10, date: new Date('2025-10-02').toISOString() },
  { id: '8', studentId: '3', groupId: '1', subject: 'Informatică Aplicată', value: 9, date: new Date('2025-10-08').toISOString() },
  { id: '9', studentId: '3', groupId: '1', subject: 'Informatică Aplicată', value: 10, date: new Date('2025-10-14').toISOString() },
  { id: '10', studentId: '3', groupId: '1', subject: 'Informatică Aplicată', value: null, date: new Date('2025-10-20').toISOString() }, // lipsă

  // Elena Popa - Informatică
  { id: '11', studentId: '3', groupId: '1', subject: 'Informatică', value: 10, date: new Date('2025-10-04').toISOString() },
  { id: '12', studentId: '3', groupId: '1', subject: 'Informatică', value: 9, date: new Date('2025-10-11').toISOString() },
  { id: '13', studentId: '3', groupId: '1', subject: 'Informatică', value: 10, date: new Date('2025-10-16').toISOString() },

  // Note pentru Dumitru Rosca (id: 2) - TI-201 - Tehnologii Informaționale
  { id: '14', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', value: 8, date: new Date('2025-10-01').toISOString() },
  { id: '15', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', value: 9, date: new Date('2025-10-08').toISOString() },
  { id: '16', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', value: 7, date: new Date('2025-10-15').toISOString() },

  // Note pentru Alexandru Rusu (id: 6) - FIZ-211
  // Nu avem grupe de fizică în mockGroups, deci nu va apărea în catalog

  // Note pentru Maria Cebotari (id: 7) - INF-213
  // Nu avem grupa INF-213 în mockGroups (doar INF-211)
];

// Absențe inițiale - DATE DEMO pentru testare
const INITIAL_ABSENCES: Absence[] = [
  // Andrei Munteanu - Informatică Aplicată - 2 absențe (1 motivată)
  { id: '1', studentId: '1', groupId: '1', subject: 'Informatică Aplicată', date: new Date('2025-09-15').toISOString(), motivated: true },
  { id: '2', studentId: '1', groupId: '1', subject: 'Informatică Aplicată', date: new Date('2025-10-07').toISOString(), motivated: false },

  // Elena Popa - Informatică - 1 absență nemotivată
  { id: '3', studentId: '3', groupId: '1', subject: 'Informatică', date: new Date('2025-10-13').toISOString(), motivated: false },

  // Dumitru Rosca - Tehnologii Informaționale - 3 absențe
  { id: '4', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', date: new Date('2025-09-20').toISOString(), motivated: false },
  { id: '5', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', date: new Date('2025-10-05').toISOString(), motivated: true },
  { id: '6', studentId: '2', groupId: '4', subject: 'Tehnologii Informaționale', date: new Date('2025-10-18').toISOString(), motivated: false },
];

/**
 * Inițializează notele în localStorage
 */
function initializeGrades(): Grade[] {
  const stored = localStorage.getItem(STORAGE_KEYS.grades);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.grades, JSON.stringify(INITIAL_GRADES));
    return INITIAL_GRADES;
  }
  return JSON.parse(stored);
}

/**
 * Inițializează absențele în localStorage
 */
function initializeAbsences(): Absence[] {
  const stored = localStorage.getItem(STORAGE_KEYS.absences);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.absences, JSON.stringify(INITIAL_ABSENCES));
    return INITIAL_ABSENCES;
  }
  return JSON.parse(stored);
}

/**
 * Obține toate notele
 */
export function getGrades(): Grade[] {
  return initializeGrades();
}

/**
 * Obține notele unui student pentru o materie specifică
 */
export function getStudentGrades(studentId: string, subject: string): Grade[] {
  const grades = getGrades();
  return grades.filter(g => g.studentId === studentId && g.subject === subject);
}

/**
 * Obține notele unei grupe pentru o materie
 */
export function getGroupGrades(groupId: string, subject: string): Grade[] {
  const grades = getGrades();
  return grades.filter(g => g.groupId === groupId && g.subject === subject);
}

/**
 * Adaugă o notă nouă
 */
export function addGrade(studentId: string, groupId: string, data: GradeFormData): Grade {
  const grades = getGrades();

  const newGrade: Grade = {
    id: Date.now().toString(),
    studentId,
    groupId,
    subject: data.subject,
    value: data.value,
    date: new Date().toISOString(),
  };

  grades.push(newGrade);
  localStorage.setItem(STORAGE_KEYS.grades, JSON.stringify(grades));

  return newGrade;
}

/**
 * Șterge o notă
 */
export function deleteGrade(id: string): boolean {
  const grades = getGrades();
  const filtered = grades.filter(g => g.id !== id);

  if (filtered.length === grades.length) return false;

  localStorage.setItem(STORAGE_KEYS.grades, JSON.stringify(filtered));
  return true;
}

/**
 * Actualizează o notă existentă
 */
export function updateGrade(id: string, newValue: number | null): Grade | null {
  const grades = getGrades();
  const index = grades.findIndex(g => g.id === id);

  if (index === -1) return null;

  grades[index] = {
    ...grades[index],
    value: newValue,
    date: new Date().toISOString(), // Actualizează data
  };

  localStorage.setItem(STORAGE_KEYS.grades, JSON.stringify(grades));
  return grades[index];
}

/**
 * Calculează media unui student pentru o materie
 */
export function calculateAverage(studentId: string, subject: string): number {
  const grades = getStudentGrades(studentId, subject);
  const validGrades = grades.filter(g => g.value !== null).map(g => g.value as number);

  if (validGrades.length === 0) return 0;

  const sum = validGrades.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / validGrades.length) * 100) / 100; // rotunjit la 2 zecimale
}

/**
 * Obține toate absențele
 */
export function getAbsences(): Absence[] {
  return initializeAbsences();
}

/**
 * Obține absențele unui student pentru o materie
 */
export function getStudentAbsences(studentId: string, subject: string): Absence[] {
  const absences = getAbsences();
  return absences.filter(a => a.studentId === studentId && a.subject === subject);
}

/**
 * Adaugă o absență
 */
export function addAbsence(studentId: string, groupId: string, subject: string, motivated: boolean = false): Absence {
  const absences = getAbsences();

  const newAbsence: Absence = {
    id: Date.now().toString(),
    studentId,
    groupId,
    subject,
    date: new Date().toISOString(),
    motivated,
  };

  absences.push(newAbsence);
  localStorage.setItem(STORAGE_KEYS.absences, JSON.stringify(absences));

  return newAbsence;
}

/**
 * Șterge o absență
 */
export function deleteAbsence(id: string): boolean {
  const absences = getAbsences();
  const filtered = absences.filter(a => a.id !== id);

  if (filtered.length === absences.length) return false;

  localStorage.setItem(STORAGE_KEYS.absences, JSON.stringify(filtered));
  return true;
}

/**
 * Calculează statistici pentru o grupă la o materie
 */
export function getGroupSubjectStats(_groupId: string, subject: string, studentIds: string[]) {
  const totalAbsences = studentIds.reduce((sum, studentId) => {
    const studentAbsences = getStudentAbsences(studentId, subject);
    return sum + studentAbsences.length;
  }, 0);

  const averages = studentIds.map(studentId => calculateAverage(studentId, subject)).filter(avg => avg > 0);
  const groupAverage = averages.length > 0
    ? Math.round((averages.reduce((sum, avg) => sum + avg, 0) / averages.length) * 100) / 100
    : 0;

  return {
    totalStudents: studentIds.length,
    groupAverage,
    totalAbsences,
  };
}

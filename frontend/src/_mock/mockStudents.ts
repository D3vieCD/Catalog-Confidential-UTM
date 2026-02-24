import { storage } from '../utils';
import { incrementGroupCapacity, decrementGroupCapacity } from './mockGroups';

export interface Student {
  id: string;
  name: string;
  email: string;
  group: string;
  year: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  group: string;
  year: number;
  status: 'active' | 'suspended';
}

const STORAGE_KEYS = {
  students: 'academix_students',
  groups: 'academix_groups',
} as const;

const DEFAULT_GROUPS: string[] = [
  'INF-211', 'INF-212', 'INF-213',
  'INF-311', 'INF-312',
  'MAT-111', 'MAT-112',
  'TI-201', 'FIZ-211',
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Andrei Munteanu',
    email: 'andrei.m@stud.usm.md',
    group: 'INF-211',
    year: 2,
    status: 'active',
    createdAt: new Date(2025, 8, 1).toISOString(),
  },
  {
    id: '2',
    name: 'Dumitru Rosca',
    email: 'dumitru.r@stud.usm.md',
    group: 'TI-201',
    year: 4,
    status: 'active',
    createdAt: new Date(2025, 8, 1).toISOString(),
  },
  {
    id: '3',
    name: 'Elena Popa',
    email: 'elena.p@stud.usm.md',
    group: 'INF-211',
    year: 2,
    status: 'active',
    createdAt: new Date(2025, 8, 2).toISOString(),
  },
  {
    id: '4',
    name: 'Mihai Ciobanu',
    email: 'mihai.c@stud.usm.md',
    group: 'MAT-111',
    year: 1,
    status: 'active',
    createdAt: new Date(2025, 8, 3).toISOString(),
  },
  {
    id: '5',
    name: 'Sofia Lungu',
    email: 'sofia.l@stud.usm.md',
    group: 'INF-311',
    year: 3,
    status: 'suspended',
    createdAt: new Date(2025, 8, 3).toISOString(),
  },
  {
    id: '6',
    name: 'Alexandru Rusu',
    email: 'alexandru.r@stud.usm.md',
    group: 'FIZ-211',
    year: 2,
    status: 'active',
    createdAt: new Date(2025, 8, 4).toISOString(),
  },
  {
    id: '7',
    name: 'Maria Cebotari',
    email: 'maria.c@stud.usm.md',
    group: 'INF-213',
    year: 2,
    status: 'active',
    createdAt: new Date(2025, 8, 5).toISOString(),
  },
  {
    id: '8',
    name: 'Ion Vrabie',
    email: 'ion.v@stud.usm.md',
    group: 'MAT-112',
    year: 1,
    status: 'active',
    createdAt: new Date(2025, 8, 5).toISOString(),
  },
];

// Students CRUD
export const getStudents = (): Student[] => {
  try {
    const raw = storage.get(STORAGE_KEYS.students);
    if (raw) {
      const parsed = JSON.parse(raw) as Student[];
      // Validare suplimentară
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Eroare la citirea studenților:', error);
    // Resetează la date default
    storage.set(STORAGE_KEYS.students, JSON.stringify(INITIAL_STUDENTS));
  }
  return [...INITIAL_STUDENTS];
};

export const saveStudents = (students: Student[]): void => {
  try {
    if (!Array.isArray(students)) {
      console.error('saveStudents: datele nu sunt un array valid');
      return;
    }
    storage.set(STORAGE_KEYS.students, JSON.stringify(students));
  } catch (error) {
    console.error('Eroare la salvarea studenților:', error);
  }
};

export const addStudent = (data: StudentFormData): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  students.push(newStudent);
  saveStudents(students);

  // Auto-incrementează capacitatea grupei
  incrementGroupCapacity(newStudent.group);

  return newStudent;
};

export const updateStudent = (id: string, data: Partial<StudentFormData>): Student | null => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;

  const oldStudent = students[index];
  const newStudent = { ...oldStudent, ...data };

  // Dacă grupa s-a schimbat, actualizează capacitățile
  // IMPORTANT: Verificăm că grupa s-a SCHIMBAT cu adevărat
  if (data.group !== undefined && oldStudent.group !== data.group) {
    try {
      decrementGroupCapacity(oldStudent.group);
      incrementGroupCapacity(data.group);
    } catch (error) {
      console.error('Eroare la actualizarea capacității grupei:', error);
      // Continuăm oricum cu salvarea studentului
    }
  }

  students[index] = newStudent;
  saveStudents(students);
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const student = students.find(s => s.id === id);

  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;

  saveStudents(filtered);

  // Auto-decrementează capacitatea grupei
  if (student) {
    decrementGroupCapacity(student.group);
  }

  return true;
};

// Groups CRUD
export const getGroups = (): string[] => {
  try {
    const raw = storage.get(STORAGE_KEYS.groups);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // fallback to defaults
  }
  storage.set(STORAGE_KEYS.groups, JSON.stringify(DEFAULT_GROUPS));
  return [...DEFAULT_GROUPS];
};

export const addGroup = (group: string): string[] => {
  const groups = getGroups();
  if (!groups.includes(group.toUpperCase())) {
    groups.push(group.toUpperCase());
    groups.sort();
    storage.set(STORAGE_KEYS.groups, JSON.stringify(groups));
  }
  return groups;
};

// Utility
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

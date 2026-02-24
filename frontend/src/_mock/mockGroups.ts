/**
 * Mock data și helpers pentru Grupe Academice
 */

export interface Group {
  id: string;
  name: string; // ex: INF-211
  year: number; // 1-4
  faculty: string; // ex: Informatică
  specialization: string; // ex: Informatică Aplicată
  coordinator: string; // ex: Prof. Dr. Ion Popescu
  maxCapacity: number; // ex: 30
  currentCapacity: number; // număr actual de studenți
  semester: 'I' | 'II';
  status: 'ACTIV' | 'ARHIVAT';
  subjects: string[]; // materii predate
  createdAt: string;
}

export interface GroupFormData {
  name: string;
  year: number;
  faculty: string;
  specialization: string;
  coordinator: string;
  maxCapacity: number;
  semester: 'I' | 'II';
  status: 'ACTIV' | 'ARHIVAT';
  subjects: string[];
}

// Facultăți disponibile
export const DEFAULT_FACULTIES = [
  'Informatică',
  'Matematică',
  'Fizică',
  'Cibernetică',
  'Inginerie Economică',
];

// Specializări disponibile (grupate pe facultate)
export const DEFAULT_SPECIALIZATIONS: Record<string, string[]> = {
  'Informatică': [
    'Informatică',
    'Informatică Aplicată',
    'Tehnologii Informaționale',
  ],
  'Matematică': [
    'Matematică',
    'Matematică și Informatică',
  ],
  'Fizică': [
    'Fizică',
    'Fizică Aplicată',
  ],
  'Cibernetică': [
    'Cibernetică',
    'Cibernetică Economică',
  ],
  'Inginerie Economică': [
    'Inginerie Economică',
  ],
};

// Grupe inițiale
const INITIAL_GROUPS: Group[] = [
  {
    id: '1',
    name: 'INF-211',
    year: 2,
    faculty: 'Informatică',
    specialization: 'Informatică',
    coordinator: 'Prof. Dr. Vasile Popescu',
    maxCapacity: 30,
    currentCapacity: 3,
    semester: 'I',
    status: 'ACTIV',
    subjects: ['Informatică', 'Informatică Aplicată'],
    createdAt: new Date('2024-09-01').toISOString(),
  },
  {
    id: '2',
    name: 'CIB-193',
    year: 1,
    faculty: 'Cibernetică',
    specialization: 'Cibernetică',
    coordinator: 'Prof. Dr. Andrei Mihai',
    maxCapacity: 28,
    currentCapacity: 1,
    semester: 'I',
    status: 'ACTIV',
    subjects: ['Cibernetică', 'Cibernetică Economică'],
    createdAt: new Date('2024-09-01').toISOString(),
  },
  {
    id: '3',
    name: 'MATE-222',
    year: 2,
    faculty: 'Matematică',
    specialization: 'Matematică și Informatică',
    coordinator: 'Prof. Dr. Elena Ionescu',
    maxCapacity: 25,
    currentCapacity: 0,
    semester: 'I',
    status: 'ACTIV',
    subjects: ['Matematică', 'Matematică și Informatică'],
    createdAt: new Date('2024-09-01').toISOString(),
  },
  {
    id: '4',
    name: 'TI-201',
    year: 4,
    faculty: 'Informatică',
    specialization: 'Tehnologii Informaționale',
    coordinator: 'Prof. Dr. Maria Dumitru',
    maxCapacity: 30,
    currentCapacity: 1,
    semester: 'II',
    status: 'ACTIV',
    subjects: ['Tehnologii Informaționale'],
    createdAt: new Date('2024-09-01').toISOString(),
  },
];

const STORAGE_KEY = 'academix_groups';
const FACULTIES_KEY = 'academix_faculties';
const SPECIALIZATIONS_KEY = 'academix_specializations';

/**
 * Inițializează grupele în localStorage dacă nu există
 */
function initializeGroups(): Group[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GROUPS));
    return INITIAL_GROUPS;
  }
  return JSON.parse(stored);
}

/**
 * Obține toate grupele
 */
export function getGroups(): Group[] {
  return initializeGroups();
}

/**
 * Obține o grupă după ID
 */
export function getGroupById(id: string): Group | null {
  const groups = getGroups();
  return groups.find(g => g.id === id) || null;
}

/**
 * Obține o grupă după nume
 */
export function getGroupByName(name: string): Group | null {
  const groups = getGroups();
  return groups.find(g => g.name === name) || null;
}

/**
 * Adaugă o grupă nouă
 */
export function addGroup(data: GroupFormData): Group {
  const groups = getGroups();

  const newGroup: Group = {
    id: Date.now().toString(),
    ...data,
    currentCapacity: 0,
    createdAt: new Date().toISOString(),
  };

  groups.push(newGroup);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));

  return newGroup;
}

/**
 * Actualizează o grupă existentă
 */
export function updateGroup(id: string, data: Partial<GroupFormData>): Group | null {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);

  if (index === -1) return null;

  groups[index] = { ...groups[index], ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));

  return groups[index];
}

/**
 * Șterge o grupă
 */
export function deleteGroup(id: string): boolean {
  const groups = getGroups();
  const filtered = groups.filter(g => g.id !== id);

  if (filtered.length === groups.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Incrementează capacitatea curentă a unei grupe (când se adaugă un student)
 */
export function incrementGroupCapacity(groupName: string): void {
  const groups = getGroups();
  const group = groups.find(g => g.name === groupName);

  if (group && group.currentCapacity < group.maxCapacity) {
    group.currentCapacity++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }
}

/**
 * Decrementează capacitatea curentă a unei grupe (când se șterge un student)
 */
export function decrementGroupCapacity(groupName: string): void {
  const groups = getGroups();
  const group = groups.find(g => g.name === groupName);

  if (group && group.currentCapacity > 0) {
    group.currentCapacity--;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }
}

/**
 * Obține toate facultățile
 */
export function getFaculties(): string[] {
  const stored = localStorage.getItem(FACULTIES_KEY);
  if (!stored) {
    localStorage.setItem(FACULTIES_KEY, JSON.stringify(DEFAULT_FACULTIES));
    return DEFAULT_FACULTIES;
  }
  return JSON.parse(stored);
}

/**
 * Adaugă o facultate nouă
 */
export function addFaculty(faculty: string): string[] {
  const faculties = getFaculties();
  if (!faculties.includes(faculty)) {
    faculties.push(faculty);
    localStorage.setItem(FACULTIES_KEY, JSON.stringify(faculties));
  }
  return faculties;
}

/**
 * Obține specializările pentru o facultate
 */
export function getSpecializations(faculty: string): string[] {
  const stored = localStorage.getItem(SPECIALIZATIONS_KEY);
  const specializations: Record<string, string[]> = stored ? JSON.parse(stored) : DEFAULT_SPECIALIZATIONS;
  return specializations[faculty] || [];
}

/**
 * Adaugă o specializare nouă pentru o facultate
 */
export function addSpecialization(faculty: string, specialization: string): string[] {
  const stored = localStorage.getItem(SPECIALIZATIONS_KEY);
  const specializations: Record<string, string[]> = stored ? JSON.parse(stored) : DEFAULT_SPECIALIZATIONS;

  if (!specializations[faculty]) {
    specializations[faculty] = [];
  }

  if (!specializations[faculty].includes(specialization)) {
    specializations[faculty].push(specialization);
    localStorage.setItem(SPECIALIZATIONS_KEY, JSON.stringify(specializations));
  }

  return specializations[faculty];
}

/**
 * Calculează statistici pentru grupe
 */
export function getGroupStats() {
  const groups = getGroups();
  const activeGroups = groups.filter(g => g.status === 'ACTIV');

  const totalStudents = groups.reduce((sum, g) => sum + g.currentCapacity, 0);
  const avgStudentsPerGroup = activeGroups.length > 0
    ? Math.round(totalStudents / activeGroups.length)
    : 0;

  const faculties = new Set(groups.map(g => g.faculty));

  return {
    totalGroups: activeGroups.length,
    totalStudents,
    avgStudentsPerGroup,
    totalFaculties: faculties.size,
  };
}

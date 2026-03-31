/**
 * Mock Data - Admin Panel
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'profesor';
  status: 'activ' | 'inactiv';
  createdAt: string;
  lastLogin: string;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalGroups: number;
  globalAverage: number;
  currentYear: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'login';
}

export interface AdminGroup {
  id: string;
  name: string;
  coordinator: string;
  faculty: string;
  year: number;
  studentCount: number;
  average: number;
  absences: number;
  status: 'activ' | 'arhivat';
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  group: string;
  faculty: string;
  year: number;
  average: number;
  absences: number;
}

export interface SystemSettings {
  institutionName: string;
  currentYear: string;
  subjects: string[];
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Administrator',
    email: 'admin',
    role: 'admin',
    status: 'activ',
    createdAt: '2024-09-01',
    lastLogin: '2026-03-27',
  },
  {
    id: '2',
    name: 'Ion Popescu',
    email: 'ion.popescu@scoala.ro',
    role: 'profesor',
    status: 'activ',
    createdAt: '2024-09-05',
    lastLogin: '2026-03-26',
  },
  {
    id: '3',
    name: 'Maria Ionescu',
    email: 'maria.ionescu@scoala.ro',
    role: 'profesor',
    status: 'activ',
    createdAt: '2024-09-05',
    lastLogin: '2026-03-25',
  },
  {
    id: '4',
    name: 'Andrei Constantin',
    email: 'andrei.constantin@scoala.ro',
    role: 'profesor',
    status: 'activ',
    createdAt: '2024-10-01',
    lastLogin: '2026-03-20',
  },
  {
    id: '5',
    name: 'Elena Dumitrescu',
    email: 'elena.dumitrescu@scoala.ro',
    role: 'profesor',
    status: 'inactiv',
    createdAt: '2024-09-10',
    lastLogin: '2025-12-15',
  },
  {
    id: '6',
    name: 'Test User',
    email: 'test',
    role: 'profesor',
    status: 'activ',
    createdAt: '2024-09-01',
    lastLogin: '2026-03-27',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 6,
  totalStudents: 87,
  totalGroups: 5,
  globalAverage: 8.4,
  currentYear: '2025-2026',
};

// ─── Activity Log ─────────────────────────────────────────────────────────────

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: '1',
    user: 'Ion Popescu',
    action: 'a adăugat nota',
    target: 'Alexandru Marin — Matematică (9.50)',
    timestamp: '2026-03-27 14:32',
    type: 'create',
  },
  {
    id: '2',
    user: 'Maria Ionescu',
    action: 'a modificat absența',
    target: 'Elena Radu — Fizică',
    timestamp: '2026-03-27 13:15',
    type: 'update',
  },
  {
    id: '3',
    user: 'Administrator',
    action: 'a creat utilizatorul',
    target: 'Andrei Constantin',
    timestamp: '2026-03-26 10:00',
    type: 'create',
  },
  {
    id: '4',
    user: 'Andrei Constantin',
    action: 's-a autentificat',
    target: 'sistem',
    timestamp: '2026-03-26 08:45',
    type: 'login',
  },
  {
    id: '5',
    user: 'Ion Popescu',
    action: 'a șters nota',
    target: 'Mihai Popa — Chimie',
    timestamp: '2026-03-25 16:20',
    type: 'delete',
  },
  {
    id: '6',
    user: 'Maria Ionescu',
    action: 'a adăugat studentul',
    target: 'Cristina Voinea — Grupa B2',
    timestamp: '2026-03-25 09:30',
    type: 'create',
  },
];

// ─── Groups ───────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_GROUPS: AdminGroup[] = [
  {
    id: '1',
    name: 'A1',
    coordinator: 'Ion Popescu',
    faculty: 'Informatică',
    year: 1,
    studentCount: 28,
    average: 8.7,
    absences: 45,
    status: 'activ',
  },
  {
    id: '2',
    name: 'A2',
    coordinator: 'Maria Ionescu',
    faculty: 'Informatică',
    year: 1,
    studentCount: 25,
    average: 8.2,
    absences: 38,
    status: 'activ',
  },
  {
    id: '3',
    name: 'B1',
    coordinator: 'Andrei Constantin',
    faculty: 'Matematică',
    year: 2,
    studentCount: 22,
    average: 8.9,
    absences: 20,
    status: 'activ',
  },
  {
    id: '4',
    name: 'B2',
    coordinator: 'Ion Popescu',
    faculty: 'Matematică',
    year: 2,
    studentCount: 12,
    average: 7.8,
    absences: 62,
    status: 'activ',
  },
  {
    id: '5',
    name: 'C1',
    coordinator: 'Elena Dumitrescu',
    faculty: 'Fizică',
    year: 3,
    studentCount: 0,
    average: 0,
    absences: 0,
    status: 'arhivat',
  },
];

// ─── Students ────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_STUDENTS: AdminStudent[] = [
  { id: '1', name: 'Alexandru Marin', email: 'alex.marin@student.ro', group: 'A1', faculty: 'Informatică', year: 1, average: 9.5, absences: 2 },
  { id: '2', name: 'Elena Radu', email: 'elena.radu@student.ro', group: 'A1', faculty: 'Informatică', year: 1, average: 8.8, absences: 4 },
  { id: '3', name: 'Mihai Popa', email: 'mihai.popa@student.ro', group: 'A1', faculty: 'Informatică', year: 1, average: 7.2, absences: 8 },
  { id: '4', name: 'Ioana Stan', email: 'ioana.stan@student.ro', group: 'A2', faculty: 'Informatică', year: 1, average: 9.1, absences: 1 },
  { id: '5', name: 'Cristina Voinea', email: 'cristina.voinea@student.ro', group: 'B2', faculty: 'Matematică', year: 2, average: 8.3, absences: 5 },
  { id: '6', name: 'Bogdan Nistor', email: 'bogdan.nistor@student.ro', group: 'B1', faculty: 'Matematică', year: 2, average: 9.7, absences: 0 },
  { id: '7', name: 'Laura Gheorghe', email: 'laura.gheorghe@student.ro', group: 'B1', faculty: 'Matematică', year: 2, average: 8.5, absences: 3 },
  { id: '8', name: 'Radu Florea', email: 'radu.florea@student.ro', group: 'A2', faculty: 'Informatică', year: 1, average: 7.6, absences: 9 },
];

// ─── Trends (ultimele 6 luni) ────────────────────────────────────────────────

export const MOCK_TRENDS = {
  users: [
    { luna: 'Oct', valoare: 2 },
    { luna: 'Nov', valoare: 3 },
    { luna: 'Dec', valoare: 3 },
    { luna: 'Ian', valoare: 4 },
    { luna: 'Feb', valoare: 5 },
    { luna: 'Mar', valoare: 6 },
  ],
  students: [
    { luna: 'Oct', valoare: 58 },
    { luna: 'Nov', valoare: 63 },
    { luna: 'Dec', valoare: 68 },
    { luna: 'Ian', valoare: 74 },
    { luna: 'Feb', valoare: 80 },
    { luna: 'Mar', valoare: 87 },
  ],
  groups: [
    { luna: 'Oct', valoare: 2 },
    { luna: 'Nov', valoare: 3 },
    { luna: 'Dec', valoare: 3 },
    { luna: 'Ian', valoare: 4 },
    { luna: 'Feb', valoare: 5 },
    { luna: 'Mar', valoare: 5 },
  ],
  average: [
    { luna: 'Oct', valoare: 7.8 },
    { luna: 'Nov', valoare: 8.0 },
    { luna: 'Dec', valoare: 7.9 },
    { luna: 'Ian', valoare: 8.2 },
    { luna: 'Feb', valoare: 8.5 },
    { luna: 'Mar', valoare: 8.4 },
  ],
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  institutionName: 'Universitatea Academix',
  currentYear: '2025-2026',
  subjects: ['Matematică', 'Fizică', 'Chimie', 'Informatică', 'Biologie', 'Limba Română', 'Istorie', 'Geografie'],
};

/**
 * Mock data pentru Rapoarte - Export/Import Excel
 */

export interface Report {
  id: string;
  date: string;
  groupId: string;
  groupName: string;
  type: 'note' | 'absente' | 'complet';
  status: 'generat' | 'procesare';
}

export interface ReportStats {
  totalReports: number;
  activeGroups: number;
  monthlyExports: number;
  monthlyImports: number;
}

const STORAGE_KEY = 'academix_reports';

// Rapoarte inițiale mock
const INITIAL_REPORTS: Report[] = [
  {
    id: '1',
    date: new Date('2026-02-23').toISOString(),
    groupId: '1',
    groupName: 'Grupa A1',
    type: 'complet',
    status: 'generat',
  },
  {
    id: '2',
    date: new Date('2026-02-22').toISOString(),
    groupId: '2',
    groupName: 'Grupa B2',
    type: 'note',
    status: 'generat',
  },
  {
    id: '3',
    date: new Date('2026-02-21').toISOString(),
    groupId: '3',
    groupName: 'Grupa C1',
    type: 'absente',
    status: 'generat',
  },
  {
    id: '4',
    date: new Date('2026-02-20').toISOString(),
    groupId: '4',
    groupName: 'Grupa A2',
    type: 'complet',
    status: 'generat',
  },
];

/**
 * Inițializează rapoartele
 */
function initializeReports(): Report[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
    return INITIAL_REPORTS;
  }
  return JSON.parse(stored);
}

/**
 * Obține toate rapoartele
 */
export function getReports(): Report[] {
  return initializeReports();
}

/**
 * Adaugă un raport nou
 */
export function addReport(groupId: string, groupName: string, type: Report['type']): Report {
  const reports = getReports();

  const newReport: Report = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    groupId,
    groupName,
    type,
    status: 'generat',
  };

  reports.unshift(newReport); // Adaugă la început
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));

  return newReport;
}

/**
 * Calculează statisticile pentru rapoarte
 */
export function getReportStats(): ReportStats {
  const reports = getReports();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyReports = reports.filter(r => {
    const reportDate = new Date(r.date);
    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
  });

  // În realitate ar trebui să luăm din mockGroups
  const activeGroups = new Set(reports.map(r => r.groupId)).size;

  return {
    totalReports: reports.length,
    activeGroups,
    monthlyExports: monthlyReports.length,
    monthlyImports: 0, // Placeholder pentru import
  };
}

/**
 * Generează date mock pentru export Excel
 */
export interface ExcelStudentData {
  nume: string;
  prenume: string;
  email: string;
  matricol: string;
  note?: number[];
  absente?: number;
}

export function generateExcelData(_groupId: string, _type: Report['type']): ExcelStudentData[] {
  // Mock data - în realitate ar trebui să ia din mockStudents și mockGrades
  return [
    {
      nume: 'Popescu',
      prenume: 'Ion',
      email: 'ion.popescu@student.usm.md',
      matricol: '2023001',
      note: [9, 8, 10, 7],
      absente: 2,
    },
    {
      nume: 'Ionescu',
      prenume: 'Maria',
      email: 'maria.ionescu@student.usm.md',
      matricol: '2023002',
      note: [10, 9, 9, 10],
      absente: 0,
    },
    {
      nume: 'Rusu',
      prenume: 'Alexandru',
      email: 'alex.rusu@student.usm.md',
      matricol: '2023003',
      note: [7, 8, 6, 7],
      absente: 5,
    },
  ];
}

/**
 * Template Excel pentru import
 */
export const EXCEL_TEMPLATE_COLUMNS = [
  'Nume student',
  'Prenume student',
  'Email',
  'Număr matricol',
];

/**
 * Validează datele din Excel import
 */
export function validateExcelData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || data.length === 0) {
    errors.push('Fișierul este gol');
    return { valid: false, errors };
  }

  // Verifică că toate rândurile au datele necesare
  data.forEach((row, index) => {
    if (!row.nume || !row.prenume) {
      errors.push(`Rândul ${index + 2}: Lipsește nume sau prenume`);
    }
    if (!row.email || !row.email.includes('@')) {
      errors.push(`Rândul ${index + 2}: Email invalid`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

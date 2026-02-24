export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'exam' | 'class' | 'meeting' | 'deadline' | 'holiday';
  location?: string;
  professor?: string;
  group?: string;
  color: string;
}

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Examen Matematică',
    description: 'Examen final - semestrul 1',
    date: new Date(2026, 1, 15), // 15 Feb 2026
    startTime: '09:00',
    endTime: '11:00',
    type: 'exam',
    location: 'Sala A101',
    professor: 'Prof. Popescu',
    group: 'Grupa A1',
    color: '#ef4444'
  },
  {
    id: '2',
    title: 'Curs Programare Web',
    description: 'Lectie despre React Hooks',
    date: new Date(2026, 1, 17), // 17 Feb 2026
    startTime: '10:00',
    endTime: '12:00',
    type: 'class',
    location: 'Sala B205',
    professor: 'Prof. Ionescu',
    group: 'Grupa B2',
    color: '#3b82f6'
  },
  {
    id: '3',
    title: 'Ședință departament',
    description: 'Discutie planuri semestru 2',
    date: new Date(2026, 1, 20), // 20 Feb 2026
    startTime: '14:00',
    endTime: '16:00',
    type: 'meeting',
    location: 'Sala de consiliu',
    color: '#8b5cf6'
  },
  {
    id: '4',
    title: 'Deadline Proiect',
    description: 'Predare proiect final',
    date: new Date(2026, 1, 25), // 25 Feb 2026
    startTime: '23:59',
    endTime: '23:59',
    type: 'deadline',
    color: '#f59e0b'
  },
  {
    id: '5',
    title: 'Laborator Baze de Date',
    description: 'SQL - JOIN operations',
    date: new Date(2026, 1, 18), // 18 Feb 2026
    startTime: '08:00',
    endTime: '10:00',
    type: 'class',
    location: 'Lab 301',
    professor: 'Asist. Marinescu',
    group: 'Grupa A3',
    color: '#10b981'
  },
  {
    id: '6',
    title: 'Conferință IT',
    description: 'Web Development Trends 2026',
    date: new Date(2026, 1, 22), // 22 Feb 2026
    startTime: '13:00',
    endTime: '17:00',
    type: 'meeting',
    location: 'Amfiteatru A',
    color: '#8b5cf6'
  },
  {
    id: '7',
    title: 'Zi liberă',
    description: 'Ziua Națională',
    date: new Date(2026, 1, 24), // 24 Feb 2026
    startTime: '00:00',
    endTime: '00:00',
    type: 'holiday',
    color: '#6b7280'
  }
];

export const getEventsForDate = (date: Date): CalendarEvent[] => {
  return mockCalendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });
};

export const getEventsForMonth = (year: number, month: number): CalendarEvent[] => {
  return mockCalendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
};

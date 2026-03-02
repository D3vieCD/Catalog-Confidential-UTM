interface ActivityItem {
  id: string;
  studentName: string;
  action: string;
  details: string;
  time: string;
  type: 'grade' | 'absence' | 'other';
}
const activities: ActivityItem[] = [
  { id: '1', studentName: 'Popescu Maria', action: 'Notă adăugată: 9', details: 'Grupa 9-B • Matematică', time: 'acum 5 min', type: 'grade' },
  { id: '2', studentName: 'Ionescu Alex', action: 'Absență nemotivată', details: 'Grupa 10-A • Fizică', time: 'acum 15 min', type: 'absence' },
  { id: '3', studentName: 'Georgescu Ana', action: 'Notă adăugată: 8', details: 'Grupa 9-B • Chimie', time: 'acum 30 min', type: 'grade' },
  { id: '4', studentName: 'Vasile Radu', action: 'Notă adăugată: 10', details: 'Grupa 11-C • Română', time: 'acum 1 oră', type: 'grade' },
];
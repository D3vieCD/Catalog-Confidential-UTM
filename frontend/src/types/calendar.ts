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

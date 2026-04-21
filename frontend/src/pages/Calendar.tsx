import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { Modal } from '../components/ui/Modal';
import { calendarService, CalendarEventPayload } from '../axios/calendarService';
import type { CalendarEvent } from '../_mock/mockCalendar';
export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'confirm';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  useEffect(() => {
    loadEvents();
  }, []);
  const loadEvents = async () => {
    try {
      const data = await calendarService.getAllEvents();
      const converted: CalendarEvent[] = data.map((ev: any) => ({
        id: String(ev.id),
        title: ev.title,
        description: ev.description,
        date: new Date(ev.startDate),
        startTime: ev.startDate.substring(11, 16),
        endTime: ev.endDate ? ev.endDate.substring(11, 16) : '',
        type: (ev.eventType as CalendarEvent['type']) || 'class',
        color: ev.color || '#3b82f6'
      }));
      setEvents(converted);
    } catch (error) {
      console.error('Eroare la încărcarea evenimentelor:', error);
    }
  };
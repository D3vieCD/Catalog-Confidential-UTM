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
  const formatLocalDate = (date: Date, hours: number, minutes: number): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(hours).padStart(2, '0');
    const min = String(minutes).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}:00`;
  };
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  const handleAddEvent = () => {
    const title = prompt('Titlul evenimentului:');
    if (!title) return;
    const description = prompt('Descriere (opțional):') || '';
    const timeInput = prompt('Ora începutului (ex: 09:00):') || '09:00';
    const [hours, minutes] = timeInput.split(':').map(Number);

    const payload: CalendarEventPayload = {
      title,
      description,
      startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
      color: '#3b82f6',
      eventType: 'class',
      userId: 1
    };
    calendarService.createEvent(payload).then(() => {
      loadEvents();
      setModalState({
        isOpen: true,
        title: 'Succes!',
        message: 'Evenimentul a fost adăugat cu succes!',
        type: 'success'
      });
    }).catch(() => {
      setModalState({
        isOpen: true,
        title: 'Eroare',
        message: 'Nu s-a putut adăuga evenimentul.',
        type: 'warning'
      });
    });
  };
  const handleEditEvent = () => {
    const selectedDayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });

    if (selectedDayEvents.length === 0) {
      setModalState({
        isOpen: true,
        title: 'Niciun Eveniment',
        message: 'Nu există evenimente pentru această zi!',
        type: 'warning'
      });
      return;
    }
    const ev = selectedDayEvents[0];
    const newTitle = prompt('Titlu nou:', ev.title);
    if (!newTitle) return;
    const newTime = prompt('Ora nouă (ex: 10:00):', ev.startTime) || ev.startTime;
    const [hours, minutes] = newTime.split(':').map(Number);

    calendarService.updateEvent(Number(ev.id), {
      title: newTitle,
      startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
      userId: 1
    }).then(() => {
      loadEvents();
      setModalState({
        isOpen: true,
        title: 'Succes!',
        message: 'Evenimentul a fost actualizat!',
        type: 'success'
      });
    });
  };
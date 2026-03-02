import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { Modal } from '../components/ui/Modal';
import { mockCalendarEvents, type CalendarEvent } from '../_mock/mockCalendar';

export const Calendar = () => {
      const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Februarie 2026, 1 Feb
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const initialMonth = new Date(2026, 1, 1);
    if (
      today.getMonth() === initialMonth.getMonth() &&
      today.getFullYear() === initialMonth.getFullYear()
    ) {
      return today;
    }
    return new Date(2026, 1, 17); // 17 Feb 2026
  });

  const [events] = useState<CalendarEvent[]>(mockCalendarEvents);

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
    const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);

    const today = new Date();
    if (
      today.getMonth() === newMonth.getMonth() &&
      today.getFullYear() === newMonth.getFullYear()
    ) {
      setSelectedDate(today);
    }
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);

    const today = new Date();
    if (
      today.getMonth() === newMonth.getMonth() &&
      today.getFullYear() === newMonth.getFullYear()
    ) {
      setSelectedDate(today);
    }
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
    console.log('Adaugă eveniment pentru data:', selectedDate.toLocaleDateString('ro-RO'));
    setModalState({
      isOpen: true,
      title: 'Adaugă Eveniment',
      message: `Vrei să adaugi un eveniment nou pentru ${selectedDate.toLocaleDateString('ro-RO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}?`,
      type: 'info'
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

    console.log('Editează evenimente pentru:', selectedDate.toLocaleDateString('ro-RO'), selectedDayEvents);
    setModalState({
      isOpen: true,
      title: 'Editare Evenimente',
      message: `Ai selectat ${selectedDayEvents.length} eveniment(e) din ${selectedDate.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })} pentru editare.`,
      type: 'info'
    });
  };
    const handleDeleteEvent = () => {
    const selectedDayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });

    if (selectedDayEvents.length === 0) {
      setModalState({
        isOpen: true,
        title: 'Niciun Eveniment',
        message: 'Nu există evenimente de șters pentru această zi!',
        type: 'warning'
      });
      return;
    }

    console.log('Șterge evenimente pentru:', selectedDate.toLocaleDateString('ro-RO'), selectedDayEvents);
    setModalState({
      isOpen: true,
      title: 'Confirmare Ștergere',
      message: `Sigur vrei să ștergi ${selectedDayEvents.length} eveniment(e) din ${selectedDate.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })}? Această acțiune nu poate fi anulată.`,
      type: 'confirm',
      onConfirm: () => {
        // TODO: Implementează logica de ștergere
        console.log('Evenimente șterse!');
        setModalState({ ...modalState, isOpen: false });

        setTimeout(() => {
          setModalState({
            isOpen: true,
            title: 'Succes!',
            message: 'Evenimentele au fost șterse cu succes!',
            type: 'success'
          });
        }, 300);
      }
    });
  };
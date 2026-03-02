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
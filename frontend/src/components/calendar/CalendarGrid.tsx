import React from 'react';
import { motion } from 'framer-motion';
import type { CalendarEvent } from '../../_mock/mockCalendar';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  events
}) => {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // Convert Sunday (0) to 7, and subtract 1 to make Monday = 0
    return firstDay === 0 ? 6 : firstDay - 1;
  };
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Previous month days
  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
  const daysInPrevMonth = getDaysInMonth(prevMonth);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
      isCurrentMonth: true
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
      isCurrentMonth: false
    });
  }
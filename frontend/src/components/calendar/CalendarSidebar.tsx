import React from 'react';
import { motion } from 'framer-motion';
import type { CalendarEvent } from '../../_mock/mockCalendar';

interface CalendarSidebarProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDate,
  events
}) => {
  const selectedDayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  // Get events for this week
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isSelected = day.date.toDateString() === selectedDate.toDateString();
          const isToday = day.date.toDateString() === new Date().toDateString();
          const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: day.isCurrentMonth ? 1.03 : 1 }}
              whileTap={{ scale: day.isCurrentMonth ? 0.97 : 1 }}
              onClick={() => onDateSelect(day.date)}
              className={`
                relative p-3 rounded-xl transition-all min-h-[90px] flex flex-col items-start
                ${!day.isCurrentMonth
                  ? 'text-gray-300 dark:text-gray-600 bg-transparent cursor-default'
                  : isToday
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : isWeekend
                  ? 'bg-gray-50 hover:bg-gray-100 text-red-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-red-400'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'
                }
                ${isSelected && !isToday
                  ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                  : ''
                }
              `}
            >
              {/* Date Number */}
              <div className={`text-base font-semibold mb-2 ${isToday ? 'text-white' : ''}`}>
                {day.date.getDate()}
              </div>

              {/* Events */}
              {day.isCurrentMonth && dayEvents.length > 0 && (
                <div className="flex flex-col gap-1 w-full">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs px-2 py-0.5 rounded truncate ${
                        isToday
                          ? 'bg-white/20 text-white'
                          : 'text-white'
                      }`}
                      style={{
                        backgroundColor: isToday ? undefined : event.color
                      }}
                      title={event.title}
                    >
                      {event.title.substring(0, 8)}...
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className={`text-xs font-medium ${isToday ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                      +{dayEvents.length - 2} mai mult
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
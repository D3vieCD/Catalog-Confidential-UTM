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
    // Initialize selected date to today if it's in the current month
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

    // If navigating to current month, select today
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

    // If navigating to current month, select today
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
        // Afișează mesaj de succes
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Calendar Academic
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vizualizează orarul și evenimentele importante
        </p>
      </motion.div>

      {/* Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar Area */}
        <div className="lg:col-span-2 space-y-4">
          <CalendarHeader
            currentMonth={currentMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            onAdd={handleAddEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />

          <CalendarGrid
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CalendarSidebar
            selectedDate={selectedDate}
            events={events}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        footer={
          <div className="flex items-center justify-end gap-3">
            {modalState.type === 'confirm' ? (
              <>
                <button
                  onClick={() => setModalState({ ...modalState, isOpen: false })}
                  className="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  Anulează
                </button>
                <button
                  onClick={() => modalState.onConfirm?.()}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Confirmă Ștergerea
                </button>
              </>
            ) : (
              <button
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                OK
              </button>
            )}
          </div>
        }
      >
        <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          {modalState.message}
        </div>
      </Modal>
    </div>
  );
};

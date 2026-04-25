import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { Modal } from '../components/ui/Modal';
import useCalendar from '../hooks/useCalendar';
import type { CalendarEvent as MockCalendarEvent } from '../_mock/mockCalendar';

export const Calendar = () => {
  const { getAllEvents, createEvent, updateEvent, deleteEvent } = useCalendar();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<MockCalendarEvent[]>([]);
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
      const data = await getAllEvents();
      const converted: MockCalendarEvent[] = data.map(ev => ({
        id: String(ev.id),
        title: ev.title,
        description: ev.description,
        date: new Date(ev.startDate),
        startTime: ev.startDate.substring(11, 16),
        endTime: ev.endDate ? ev.endDate.substring(11, 16) : '',
        type: (ev.eventType as MockCalendarEvent['type']) || 'class',
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

    createEvent({
      title,
      description,
      startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
      color: '#3b82f6',
      eventType: 'class',
      userId: 1
    }).then(() => {
      loadEvents();
      setModalState({ isOpen: true, title: 'Succes!', message: 'Evenimentul a fost adăugat cu succes!', type: 'success' });
    }).catch(() => {
      setModalState({ isOpen: true, title: 'Eroare', message: 'Nu s-a putut adăuga evenimentul.', type: 'warning' });
    });
  };

  const handleEditEvent = () => {
    const selectedDayEvents = events.filter(event =>
      new Date(event.date).toDateString() === selectedDate.toDateString()
    );

    if (selectedDayEvents.length === 0) {
      setModalState({ isOpen: true, title: 'Niciun Eveniment', message: 'Nu există evenimente pentru această zi!', type: 'warning' });
      return;
    }

    const ev = selectedDayEvents[0];
    const newTitle = prompt('Titlu nou:', ev.title);
    if (!newTitle) return;
    const newTime = prompt('Ora nouă (ex: 10:00):', ev.startTime) || ev.startTime;
    const [hours, minutes] = newTime.split(':').map(Number);

    updateEvent(Number(ev.id), {
      title: newTitle,
      startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
      userId: 1
    }).then(() => {
      loadEvents();
      setModalState({ isOpen: true, title: 'Succes!', message: 'Evenimentul a fost actualizat!', type: 'success' });
    });
  };

  const handleDeleteEvent = () => {
    const selectedDayEvents = events.filter(event =>
      new Date(event.date).toDateString() === selectedDate.toDateString()
    );

    if (selectedDayEvents.length === 0) {
      setModalState({ isOpen: true, title: 'Niciun Eveniment', message: 'Nu există evenimente de șters pentru această zi!', type: 'warning' });
      return;
    }

    setModalState({
      isOpen: true,
      title: 'Confirmare Ștergere',
      message: `Sigur vrei să ștergi ${selectedDayEvents.length} eveniment(e)?`,
      type: 'confirm',
      onConfirm: async () => {
        for (const ev of selectedDayEvents) {
          await deleteEvent(Number(ev.id));
        }
        loadEvents();
        setModalState({ isOpen: true, title: 'Succes!', message: 'Evenimentele au fost șterse!', type: 'success' });
      }
    });
  };

  const selectedDayEvents = events.filter(event =>
    new Date(event.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar Academic</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Vizualizează orarul și evenimentele importante</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedDate.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            {selectedDayEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Niciun eveniment pentru această zi.</p>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map(ev => (
                  <div key={ev.id} className="border-l-4 pl-3 py-1" style={{ borderColor: ev.color }}>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{ev.title}</p>
                    {ev.description && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{ev.description}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-0.5">🕐 {ev.startTime}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4">
            <CalendarSidebar selectedDate={selectedDate} events={events} />
          </div>
        </div>
      </div>

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

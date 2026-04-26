import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { CalendarSidebar } from '../components/calendar/CalendarSidebar';
import { CalendarEventModal, type EventFormData } from '../components/calendar/CalendarEventModal';
import { Modal } from '../components/ui/Modal';
import useCalendar from '../hooks/useCalendar';
import { storage } from '../utils';
import type { CalendarEvent } from '../types/calendar';

export const Calendar = () => {
  const { getAllEvents, createEvent, updateEvent, deleteEvent } = useCalendar();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [eventModal, setEventModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    initialData?: Partial<EventFormData>;
    eventId?: number;
  }>({ isOpen: false, mode: 'add' });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    eventId?: number;
    eventTitle?: string;
  }>({ isOpen: false });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, title: '', message: '' });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      const converted: CalendarEvent[] = data.map(ev => ({
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

  const handlePreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date) => setSelectedDate(date);

  const handleAddEvent = () => {
    setEventModal({ isOpen: true, mode: 'add' });
  };

  const handleEditEvent = (ev: CalendarEvent) => {
    setEventModal({
      isOpen: true,
      mode: 'edit',
      eventId: Number(ev.id),
      initialData: {
        title: ev.title,
        description: ev.description || '',
        startTime: ev.startTime,
        color: ev.color,
        eventType: ev.type,
      }
    });
  };

  const handleDeleteEvent = (ev: CalendarEvent) => {
    setDeleteModal({ isOpen: true, eventId: Number(ev.id), eventTitle: ev.title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.eventId) return;
    try {
      await deleteEvent(deleteModal.eventId);
      setDeleteModal({ isOpen: false });
      loadEvents();
    } catch {
      setDeleteModal({ isOpen: false });
      setAlertModal({ isOpen: true, title: 'Eroare', message: 'Nu s-a putut șterge evenimentul.' });
    }
  };

  const handleEventModalSubmit = (data: EventFormData) => {
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const userId = Number(storage.get('userId')) || 0;
    setEventModal(m => ({ ...m, isOpen: false }));

    if (eventModal.mode === 'add') {
      createEvent({
        title: data.title,
        description: data.description,
        startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
        color: data.color,
        eventType: data.eventType,
        userId
      }).then(() => {
        loadEvents();
        setAlertModal({ isOpen: true, title: 'Succes!', message: 'Evenimentul a fost adăugat!' });
      }).catch(() => {
        setAlertModal({ isOpen: true, title: 'Eroare', message: 'Nu s-a putut adăuga evenimentul.' });
      });
    } else if (eventModal.eventId) {
      updateEvent(eventModal.eventId, {
        title: data.title,
        description: data.description,
        startDate: formatLocalDate(selectedDate, hours || 9, minutes || 0),
        color: data.color,
        eventType: data.eventType,
        userId
      }).then(() => {
        loadEvents();
        setAlertModal({ isOpen: true, title: 'Succes!', message: 'Evenimentul a fost actualizat!' });
      }).catch(() => {
        setAlertModal({ isOpen: true, title: 'Eroare', message: 'Nu s-a putut actualiza evenimentul.' });
      });
    }
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
          />
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
        </div>

        <div className="lg:col-span-1 space-y-4">
          {/* Events for selected day */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {selectedDate.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <button
                onClick={handleAddEvent}
                title="Adaugă eveniment"
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">
                Niciun eveniment pentru această zi.
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {selectedDayEvents.map(ev => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: ev.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{ev.title}</p>
                        {ev.description && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">{ev.description}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {ev.startTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => handleEditEvent(ev)}
                          title="Editează"
                          className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 text-gray-400 hover:text-amber-500 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev)}
                          title="Șterge"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <CalendarSidebar selectedDate={selectedDate} events={events} />
        </div>
      </div>

      {/* Modal adaugă / editează */}
      <CalendarEventModal
        isOpen={eventModal.isOpen}
        mode={eventModal.mode}
        selectedDate={selectedDate}
        initialData={eventModal.initialData}
        onClose={() => setEventModal(m => ({ ...m, isOpen: false }))}
        onSubmit={handleEventModalSubmit}
      />

      {/* Modal confirmare ștergere */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Confirmare ștergere"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Șterge
            </button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Sigur vrei să ștergi evenimentul <span className="font-semibold">„{deleteModal.eventTitle}"</span>?
        </p>
      </Modal>

      {/* Modal alertă */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              OK
            </button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300 text-sm">{alertModal.message}</p>
      </Modal>
    </div>
  );
};

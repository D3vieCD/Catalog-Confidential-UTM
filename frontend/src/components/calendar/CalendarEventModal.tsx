import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Type, AlignLeft } from 'lucide-react';

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  color: string;
  eventType: string;
}

interface CalendarEventModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  selectedDate: Date;
  initialData?: Partial<EventFormData>;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
}

const COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Albastru' },
  { value: '#059669', label: 'Verde' },
  { value: '#f59e0b', label: 'Portocaliu' },
  { value: '#ef4444', label: 'Roșu' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Roz' },
];

const EVENT_TYPES = [
  { value: 'class',    label: 'Curs' },
  { value: 'exam',     label: 'Examen' },
  { value: 'meeting',  label: 'Întâlnire' },
  { value: 'deadline', label: 'Termen limită' },
  { value: 'holiday',  label: 'Vacanță' },
];

const DEFAULT_FORM: EventFormData = {
  title: '',
  description: '',
  startTime: '09:00',
  color: '#3b82f6',
  eventType: 'class',
};

export const CalendarEventModal = ({
  isOpen,
  mode,
  selectedDate,
  initialData,
  onClose,
  onSubmit,
}: CalendarEventModalProps) => {
  const [form, setForm] = useState<EventFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        startTime: initialData?.startTime ?? '09:00',
        color: initialData?.color ?? '#3b82f6',
        eventType: initialData?.eventType ?? 'class',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  const dateLabel = selectedDate.toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-md"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: form.color }}>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {mode === 'add' ? 'Eveniment nou' : 'Editează eveniment'}
                    </h3>
                    <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateLabel}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form id="calendar-event-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      <Type className="w-3.5 h-3.5" /> Titlu
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Ex: Curs Matematică"
                      required
                      autoFocus
                      className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      <AlignLeft className="w-3.5 h-3.5" /> Descriere <span className="normal-case font-normal text-gray-400">(opțional)</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Detalii suplimentare..."
                      rows={2}
                      className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Time */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        <Clock className="w-3.5 h-3.5" /> Ora
                      </label>
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                        className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        Tip
                      </label>
                      <select
                        value={form.eventType}
                        onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}
                        className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                      >
                        {EVENT_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Culoare
                    </label>
                    <div className="flex gap-2.5">
                      {COLOR_OPTIONS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          title={c.label}
                          onClick={() => setForm(f => ({ ...f, color: c.value }))}
                          className={`w-7 h-7 rounded-full transition-all duration-150 ${
                            form.color === c.value
                              ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800 scale-110'
                              : 'hover:scale-110 opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.value }}
                        />
                      ))}
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    form="calendar-event-form"
                    className="px-5 py-2 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg hover:opacity-90"
                    style={{ backgroundColor: form.color }}
                  >
                    {mode === 'add' ? '+ Adaugă' : 'Salvează'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

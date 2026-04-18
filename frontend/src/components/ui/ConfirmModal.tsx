import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

/**
 * Props pentru componenta ConfirmModal
 */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * ConfirmModal - Modală de confirmare frumoasă în centrul ecranului
 * Include animații smooth, backdrop blur și design modern
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmă',
  cancelText = 'Anulează'
}: ConfirmModalProps) => {
  // Nu afișa modală dacă nu este deschisă
  if (!isOpen) return null;

  /**
   * Gestionează confirmarea acțiunii
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay cu blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Conținut modală */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Iconă de atenționare */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Titlu */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          {title}
        </h3>

        {/* Mesaj */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {message}
        </p>

        {/* Butoane de acțiune */}
        <div className="flex gap-3">
          {/* Buton de anulare */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {cancelText}
          </button>

          {/* Buton de confirmare */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

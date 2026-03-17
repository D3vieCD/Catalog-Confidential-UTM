interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`.trim()}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}
    </label>
  );
};

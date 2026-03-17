interface DividerProps {
  text?: string;
}

export const Divider = ({ text = 'sau continuă cu' }: DividerProps) => {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 font-medium bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
          {text}
        </span>
      </div>
    </div>
  );
};

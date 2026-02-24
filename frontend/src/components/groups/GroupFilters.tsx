import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

// Custom Dropdown Component (refolosit din StudentFilters)
interface DropdownOption {
  value: string;
  label: string;
}

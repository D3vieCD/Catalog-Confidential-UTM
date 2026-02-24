import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Group, GroupFormData } from '../../_mock/mockGroups';
import { getFaculties, addFaculty, getSpecializations, addSpecialization } from '../../_mock/mockGroups';
import { Modal } from '../ui/Modal';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GroupFormData) => void;
  group?: Group | null;
}

// Custom Dropdown Component
interface DropdownOption {
  value: string | number;
  label: string;
}
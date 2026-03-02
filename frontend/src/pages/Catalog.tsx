import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGroups } from '../_mock/mockGroups';
import { getStudents } from '../_mock/mockStudents';

/**
 * Catalog - Pagina principală cu lista de grupe
 * Selectează o grupă pentru a vizualiza catalogul
 */
export const Catalog = () => {
  const navigate = useNavigate();

  return <div />;
};
const [groups] = useState(() => getGroups().filter(g => g.status === 'ACTIV'));
const [students] = useState(() => getStudents());
const groupsWithStudentCount = useMemo(() => {
  return groups.map(group => ({
    ...group,
    studentCount: students.filter(
      s => s.group === group.name && s.status === 'active'
    ).length,
  }));
}, [groups, students]);
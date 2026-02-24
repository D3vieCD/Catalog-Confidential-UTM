import { motion } from 'framer-motion';

interface GroupStatsProps {
  totalGroups: number;
  totalStudents: number;
  avgStudentsPerGroup: number;
  totalFaculties: number;
}

export const GroupStats: React.FC<GroupStatsProps> = ({
  totalGroups,
  totalStudents,
  avgStudentsPerGroup,
  totalFaculties,
}) => {
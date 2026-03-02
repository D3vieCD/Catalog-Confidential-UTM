import type { Student } from '../../_mock/mockStudents';
import { StudentCard } from './StudentCard';
import { StudentListItem } from './StudentListItem';

interface StudentGridProps {
  students: Student[];
  viewMode: 'grid' | 'list';
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  viewMode,
  onEdit,
  onDelete
}) => {
  return <div></div>;
};
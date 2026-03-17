import type { Student } from '../../_mock/mockStudents';
import { StudentCard } from './StudentCard';
import { StudentListItem } from './StudentListItem';

interface StudentGridProps {
  students: Student[];
  viewMode: 'grid' | 'list';
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({ students, viewMode, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">
          Nu au fost găsiți studenți
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Încearcă să modifici filtrele sau adaugă un student nou.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {students.map((student, index) => (
          <StudentListItem
            key={student.id}
            student={student}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {students.map((student, index) => (
        <StudentCard
          key={student.id}
          student={student}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
};

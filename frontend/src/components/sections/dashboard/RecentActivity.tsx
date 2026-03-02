interface ActivityItem {
  id: string;
  studentName: string;
  action: string;
  details: string;
  time: string;
  type: 'grade' | 'absence' | 'other';
}
const activities: ActivityItem[] = [
    {
      id: '1',
      studentName: 'Popescu Maria',
      action: 'Notă adăugată: 9',
      details: 'Grupa 9-B • Matematică',
      time: 'acum 5 min',
      type: 'grade',
    },
    {
      id: '2',
      studentName: 'Ionescu Alex',
      action: 'Absență nemotivată',
      details: 'Grupa 10-A • Fizică',
      time: 'acum 15 min',
      type: 'absence',
    },
    {
      id: '3',
      studentName: 'Georgescu Ana',
      action: 'Notă adăugată: 8',
      details: 'Grupa 9-B • Chimie',
      time: 'acum 30 min',
      type: 'grade',
    },
    {
      id: '4',
      studentName: 'Vasile Radu',
      action: 'Notă adăugată: 10',
      details: 'Grupa 11-C • Română',
      time: 'acum 1 oră',
      type: 'grade',
    },
  ];
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'grade':
        return (
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        );
      case 'absence':
        return (
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        );
    }
  };
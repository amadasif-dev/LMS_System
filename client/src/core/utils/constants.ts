export const ROLES = {
  SUPER_ADMIN: 'super_admin' as const,
  SCHOOL_ADMIN: 'school_admin' as const,
  TEACHER: 'teacher' as const,
  STUDENT: 'student' as const,
  PARENT: 'parent' as const,
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  UNAUTHORIZED: '/unauthorized',
  
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TENANTS: '/admin/tenants',
    SETTINGS: '/admin/settings',
  },
  
  SCHOOL_ADMIN: {
    DASHBOARD: '/school-admin/dashboard',
    COURSES: '/school-admin/courses',
    STUDENTS: '/school-admin/students',
    TEACHERS: '/school-admin/teachers',
    ANALYTICS: '/school-admin/analytics',
    SETTINGS: '/school-admin/settings',
  },
  
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    MY_COURSES: '/teacher/courses',
    COURSE_DETAILS: '/teacher/courses/:id',
    CREATE_COURSE: '/teacher/courses/create',
    EDIT_COURSE: '/teacher/courses/:id/edit',
    CREATE_QUIZ: '/teacher/quizzes/create',
    GRADING: '/teacher/grading',
    TIMETABLE: '/teacher/timetable',
    ANNOUNCEMENTS: '/teacher/announcements',
  },
  
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    MY_LEARNING: '/student/learning',
    COURSE_PLAYER: '/student/courses/:id/learn',
    QUIZ_ATTEMPT: '/student/quizzes/:id',
    ASSIGNMENTS: '/student/assignments',
    TIMETABLE: '/student/timetable',
    CERTIFICATES: '/student/certificates',
  },
  
  PARENT: {
    DASHBOARD: '/parent/dashboard',
    CHILD_PROGRESS: '/parent/progress',
    ATTENDANCE: '/parent/attendance',
    PAYMENTS: '/parent/payments',
  },
};

export const COURSE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  OVERDUE: 'overdue',
};

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

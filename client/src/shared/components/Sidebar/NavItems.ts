import type { UserRole } from '../../../core/api/types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['super_admin', 'school_admin', 'teacher', 'student'],
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: 'BookOpen',
    roles: ['school_admin', 'teacher', 'student'],
  },
  {
    label: 'My Courses',
    href: '/teacher/courses',
    icon: 'GraduationCap',
    roles: ['teacher'],
  },
  {
    label: 'Students',
    href: '/students',
    icon: 'Users',
    roles: ['school_admin', 'teacher'],
  },
  {
    label: 'Teachers',
    href: '/teachers',
    icon: 'UserCog',
    roles: ['school_admin'],
  },
  {
    label: 'Quizzes',
    href: '/quizzes',
    icon: 'FileQuestion',
    roles: ['school_admin', 'teacher', 'student'],
  },
  {
    label: 'Assignments',
    href: '/assignments',
    icon: 'ClipboardList',
    roles: ['school_admin', 'teacher', 'student'],
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: 'CalendarCheck',
    roles: ['school_admin', 'teacher'],
  },
  {
    label: 'Timetable',
    href: '/timetable',
    icon: 'CalendarDays',
    roles: ['school_admin', 'teacher', 'student'],
  },
  {
    label: 'Payments',
    href: '/payments',
    icon: 'CreditCard',
    roles: ['school_admin', 'student'],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3',
    roles: ['super_admin', 'school_admin', 'teacher'],
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: 'MessageSquare',
    roles: ['school_admin', 'teacher', 'student'],
  },
  {
    label: 'Certificates',
    href: '/certificates',
    icon: 'Award',
    roles: ['student'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: ['super_admin', 'school_admin'],
  },
];

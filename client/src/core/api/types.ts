export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';

export interface IUser {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITenant {
  _id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  primaryColor?: string;
  isActive: boolean;
  subscription: {
    plan: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isFree: boolean;
  instructor: string | IUser;
  tenantId: string;
  modules: IModule[];
  enrolledStudents: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IModule {
  _id: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface ILesson {
  _id: string;
  title: string;
  type: 'video' | 'pdf' | 'text' | 'quiz';
  content: string;
  duration?: number;
  order: number;
  releaseDate?: string;
}

export interface IQuiz {
  _id: string;
  title: string;
  description?: string;
  courseId: string | ICourse;
  questions: IQuestion[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  createdAt: string;
}

export interface IQuestion {
  _id: string;
  text: string;
  type: 'mcq' | 'true_false' | 'descriptive';
  options?: { text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  explanation?: string;
  marks: number;
}

export interface IAssignment {
  _id: string;
  title: string;
  description: string;
  courseId: string | ICourse;
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  submissions?: ISubmission[];
  createdAt: string;
}

export interface ISubmission {
  _id: string;
  studentId: string | IUser;
  content: string;
  files?: string[];
  grade?: number;
  feedback?: string;
  isLate: boolean;
  submittedAt: string;
}

export interface IAttendance {
  _id: string;
  courseId: string | ICourse;
  studentId: string | IUser;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string | IUser;
}

export interface ITimetableEntry {
  _id: string;
  day: string;
  slots: {
    subject: string;
    teacher: string | IUser;
    room: string;
    startTime: string;
    endTime: string;
  }[];
  tenantId: string;
}

export interface IPayment {
  _id: string;
  studentId: string | IUser;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'overdue';
  invoiceNumber: string;
  description: string;
  createdAt: string;
}

export interface IFeeStructure {
  _id: string;
  name: string;
  amount: number;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  tenantId: string;
}

export interface ICertificate {
  _id: string;
  studentId: string | IUser;
  courseId: string | ICourse;
  certificateNumber: string;
  issuedDate: string;
  templateData: Record<string, string>;
}

export interface IMessage {
  _id: string;
  senderId: string | IUser;
  receiverId: string | IUser;
  content: string;
  courseId?: string;
  createdAt: string;
}

export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  author: string | IUser;
  targetAudience: 'all' | 'students' | 'teachers' | 'course';
  courseId?: string;
  tenantId: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DashboardStats {
  students: number;
  teachers: number;
  courses: number;
  revenue: number;
  activeEnrollments: number;
  averageAttendance: number;
}

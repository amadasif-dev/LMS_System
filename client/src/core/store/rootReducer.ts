import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import courseReducer from './slices/courseSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import quizReducer from './slices/quizSlice';
import assignmentReducer from './slices/assignmentSlice';
import attendanceReducer from './slices/attendanceSlice';
import timetableReducer from './slices/timetableSlice';
import analyticsReducer from './slices/analyticsSlice';
import paymentReducer from './slices/paymentSlice';
import certificateReducer from './slices/certificateSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  courses: courseReducer,
  students: studentReducer,
  teachers: teacherReducer,
  quizzes: quizReducer,
  assignments: assignmentReducer,
  attendance: attendanceReducer,
  timetable: timetableReducer,
  analytics: analyticsReducer,
  payments: paymentReducer,
  certificates: certificateReducer,
  chat: chatReducer,
  notifications: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

import { Response, NextFunction } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Attendance from '../models/Attendance';
import Payment from '../models/Payment';
import CourseProgress from '../models/CourseProgress';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId;
    const [students, teachers, courses, revenue] = await Promise.all([
      User.countDocuments({ tenantId, role: 'student' }),
      User.countDocuments({ tenantId, role: 'teacher' }),
      Course.countDocuments({ tenantId }),
      Payment.aggregate([
        { $match: { tenantId: tenantId as any, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: { students, teachers, courses, revenue: revenue[0]?.total || 0 },
    });
  } catch (error) {
    next(error);
  }
};

export const getEnrollmentTrends = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trends = await Course.aggregate([
      { $match: { tenantId: req.user?.tenantId as any } },
      { $project: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' }, enrolledCount: { $size: '$enrolledStudents' } } },
      { $group: { _id: { month: '$month', year: '$year' }, totalEnrollments: { $sum: '$enrolledCount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ success: true, data: trends });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await Attendance.aggregate([
      { $match: { tenantId: req.user?.tenantId as any } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getCourseCompletionRates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rates = await CourseProgress.aggregate([
      { $match: { tenantId: req.user?.tenantId as any } },
      { $group: { _id: '$courseId', avgProgress: { $avg: '$overallProgress' }, completed: { $sum: { $cond: ['$isCompleted', 1, 0] } }, total: { $sum: 1 } } },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { courseName: '$course.title', avgProgress: 1, completionRate: { $multiply: [{ $divide: ['$completed', '$total'] }, 100] } } },
    ]);

    res.json({ success: true, data: rates });
  } catch (error) {
    next(error);
  }
};

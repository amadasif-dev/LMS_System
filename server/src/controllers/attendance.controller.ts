import { Response, NextFunction } from 'express';
import Attendance from '../models/Attendance';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const markAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = req.body.records;
    const results = await Promise.all(
      records.map((r: any) =>
        Attendance.findOneAndUpdate(
          { studentId: r.studentId, courseId: req.body.courseId, date: req.body.date, tenantId: req.user?.tenantId },
          { status: r.status, method: req.body.method || 'manual', markedBy: req.user?.id, tenantId: req.user?.tenantId },
          { upsert: true, new: true }
        )
      )
    );
    res.status(201).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, date, studentId, page = 1, limit = 50 } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (courseId) query.courseId = courseId;
    if (date) query.date = new Date(date as string);
    if (studentId) query.studentId = studentId;

    const records = await Attendance.find(query)
      .populate('studentId', 'firstName lastName email')
      .populate('courseId', 'title')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);
    res.json({ success: true, data: records, total });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (courseId) query.courseId = courseId;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

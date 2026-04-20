import { Response, NextFunction } from 'express';
import Timetable from '../models/Timetable';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createTimetable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await Timetable.create({ ...req.body, tenantId: req.user?.tenantId });
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

export const getTimetable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { className, day } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (className) query.className = className;
    if (day) query.day = day;

    const entries = await Timetable.find(query)
      .populate('slots.teacherId', 'firstName lastName')
      .populate('slots.courseId', 'title')
      .sort({ day: 1 });

    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

export const updateTimetable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const entry = await Timetable.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body, { new: true, runValidators: true }
    );
    if (!entry) throw createError('Timetable entry not found', 404);
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

export const deleteTimetable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Timetable.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    res.json({ success: true, message: 'Timetable entry deleted' });
  } catch (error) {
    next(error);
  }
};

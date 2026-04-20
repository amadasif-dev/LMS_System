import { Response, NextFunction } from 'express';
import Course from '../models/Course';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.create({ ...req.body, tenantId: req.user?.tenantId, teacherId: req.user?.id });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(query)
      .populate('teacherId', 'firstName lastName')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);
    res.json({ success: true, data: courses, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
      .populate('teacherId', 'firstName lastName email');
    if (!course) throw createError('Course not found', 404);
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) throw createError('Course not found', 404);
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!course) throw createError('Course not found', 404);
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

export const enrollStudent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw createError('Course not found', 404);

    const studentId = req.user?.id;
    if (course.enrolledStudents.includes(studentId as any)) {
      throw createError('Already enrolled', 400);
    }

    course.enrolledStudents.push(studentId as any);
    await course.save();
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (error) {
    next(error);
  }
};

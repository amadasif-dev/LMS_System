import { Response, NextFunction } from 'express';
import Certificate from '../models/Certificate';
import CourseProgress from '../models/CourseProgress';
import Course from '../models/Course';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const generateCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.body;
    const progress = await CourseProgress.findOne({ studentId: req.user?.id, courseId });
    if (!progress || !progress.isCompleted) throw createError('Course not completed yet', 400);

    const existing = await Certificate.findOne({ studentId: req.user?.id, courseId });
    if (existing) return res.json({ success: true, data: existing });

    const student = await User.findById(req.user?.id);
    const course = await Course.findById(courseId);
    if (!student || !course) throw createError('Student or course not found', 404);

    const cert = await Certificate.create({
      studentId: req.user?.id,
      courseId,
      tenantId: req.user?.tenantId,
      certificateNumber: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      templateData: {
        studentName: `${student.firstName} ${student.lastName}`,
        courseName: course.title,
        completionDate: new Date().toISOString().split('T')[0],
      },
    });

    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

export const getCertificates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query: any = { tenantId: req.user?.tenantId };
    if (req.user?.role === 'student') query.studentId = req.user.id;

    const certs = await Certificate.find(query)
      .populate('studentId', 'firstName lastName')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: certs });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await Certificate.findOne({ certificateNumber: req.params.certNumber })
      .populate('studentId', 'firstName lastName')
      .populate('courseId', 'title');
    if (!cert) throw createError('Certificate not found', 404);
    res.json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

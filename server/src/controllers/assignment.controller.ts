import { Response, NextFunction } from 'express';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await Assignment.create({ ...req.body, tenantId: req.user?.tenantId, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { courseId, page = 1, limit = 10 } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (courseId) query.courseId = courseId;

    const assignments = await Assignment.find(query)
      .populate('courseId', 'title')
      .populate('createdBy', 'firstName lastName')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Assignment.countDocuments(query);
    res.json({ success: true, data: assignments, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (error) {
    next(error);
  }
};

export const getAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, tenantId: req.user?.tenantId })
      .populate('courseId', 'title').populate('createdBy', 'firstName lastName');
    if (!assignment) throw createError('Assignment not found', 404);
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      req.body, { new: true, runValidators: true }
    );
    if (!assignment) throw createError('Assignment not found', 404);
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Assignment.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const submission = await Submission.create({
      assignmentId: req.params.id,
      studentId: req.user?.id,
      tenantId: req.user?.tenantId,
      fileUrl: req.body.fileUrl,
    });
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id, tenantId: req.user?.tenantId })
      .populate('studentId', 'firstName lastName email');
    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      { grade, feedback, gradedBy: req.user?.id, gradedAt: new Date(), status: 'graded' },
      { new: true }
    );
    if (!submission) throw createError('Submission not found', 404);
    res.json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

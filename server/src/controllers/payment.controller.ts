import { Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import FeeStructure from '../models/FeeStructure';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createFeeStructure = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fee = await FeeStructure.create({ ...req.body, tenantId: req.user?.tenantId });
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    next(error);
  }
};

export const getFeeStructures = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fees = await FeeStructure.find({ tenantId: req.user?.tenantId }).sort({ createdAt: -1 });
    res.json({ success: true, data: fees });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const payment = await Payment.create({ ...req.body, tenantId: req.user?.tenantId, invoiceNumber });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { studentId, status, page = 1, limit = 10 } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('studentId', 'firstName lastName email')
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);
    res.json({ success: true, data: payments, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) throw createError('Payment not found', 404);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

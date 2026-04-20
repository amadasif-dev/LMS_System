import { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, domain, contactEmail, contactPhone, address, plan } = req.body;

    const existing = await Tenant.findOne({ domain });
    if (existing) throw createError('Domain already registered', 400);

    const tenant = await Tenant.create({ name, domain, contactEmail, contactPhone, address, plan });
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const getTenants = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tenants, count: tenants.length });
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) throw createError('Tenant not found', 404);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tenant) throw createError('Tenant not found', 404);
    res.json({ success: true, data: tenant });
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) throw createError('Tenant not found', 404);
    await User.deleteMany({ tenantId: req.params.id });
    res.json({ success: true, message: 'Tenant deleted' });
  } catch (error) {
    next(error);
  }
};

export const getTenantStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user?.tenantId;
    const studentCount = await User.countDocuments({ tenantId, role: 'student' });
    const teacherCount = await User.countDocuments({ tenantId, role: 'teacher' });

    res.json({ success: true, data: { students: studentCount, teachers: teacherCount } });
  } catch (error) {
    next(error);
  }
};

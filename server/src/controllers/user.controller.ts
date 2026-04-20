import { Response, NextFunction } from 'express';
import User from '../models/User';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query: any = { tenantId: req.user?.tenantId };
    if (role) query.role = role;
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const users = await User.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!user) throw createError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.create({ ...req.body, tenantId: req.user?.tenantId });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user?.tenantId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!user) throw createError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, tenantId: req.user?.tenantId });
    if (!user) throw createError('User not found', 404);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

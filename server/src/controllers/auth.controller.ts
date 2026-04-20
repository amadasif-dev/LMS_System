import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Tenant from '../models/Tenant';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (user: any) => {
  const payload = { id: user._id, role: user.role, tenantId: user.tenantId, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 86400 });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: 604800 });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, tenantId, phone } = req.body;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw createError('Tenant not found', 404);

    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) throw createError('User already exists in this organization', 400);

    const user = await User.create({ firstName, lastName, email, password, role: role || 'student', tenantId, phone });
    const tokens = generateTokens(user);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, tenantId: user.tenantId },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, tenantId } = req.body;
    if (!email || !password) throw createError('Email and password are required', 400);

    const user = await User.findOne({ email, ...(tenantId && { tenantId }) }).select('+password');
    if (!user) throw createError('Invalid credentials', 401);
    if (!user.isActive) throw createError('Account is deactivated', 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw createError('Invalid credentials', 401);

    user.lastLogin = new Date();
    await user.save();

    const tokens = generateTokens(user);

    res.json({
      success: true,
      data: {
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, tenantId: user.tenantId, avatar: user.avatar },
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id).populate('tenantId', 'name logo primaryColor');
    if (!user) throw createError('User not found', 404);

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError('Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;
    const user = await User.findById(decoded.id);
    if (!user) throw createError('User not found', 404);

    const tokens = generateTokens(user);
    res.json({ success: true, data: tokens });
  } catch (error) {
    next(createError('Invalid refresh token', 401));
  }
};

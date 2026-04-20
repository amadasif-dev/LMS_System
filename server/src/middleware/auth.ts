import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    tenantId: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      role: string;
      tenantId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(createError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(createError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(createError('Insufficient permissions', 403));
      return;
    }
    next();
  };
};

export const tenantIsolation = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  if (!req.user?.tenantId) {
    next(createError('Tenant context required', 400));
    return;
  }
  next();
};

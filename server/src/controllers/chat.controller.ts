import { Response, NextFunction } from 'express';
import Message from '../models/Chat';
import Announcement from '../models/Announcement';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.create({
      senderId: req.user?.id,
      receiverId: req.body.receiverId,
      tenantId: req.user?.tenantId,
      content: req.body.content,
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      tenantId: req.user?.tenantId,
      $or: [
        { senderId: req.user?.id, receiverId: userId },
        { senderId: userId, receiverId: req.user?.id },
      ],
    })
      .populate('senderId', 'firstName lastName avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.aggregate([
      { $match: { tenantId: req.user?.tenantId as any, $or: [{ senderId: req.user?.id as any }, { receiverId: req.user?.id as any }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: { $cond: [{ $eq: ['$senderId', req.user?.id] }, '$receiverId', '$senderId'] }, lastMessage: { $first: '$$ROOT' } } },
    ]);
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const announcement = await Announcement.create({ ...req.body, tenantId: req.user?.tenantId, createdBy: req.user?.id });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const announcements = await Announcement.find({ tenantId: req.user?.tenantId })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    next(error);
  }
};

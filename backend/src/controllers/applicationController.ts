import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Application } from '../models/Application';
import { AuthenticatedRequest } from '../types';

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user?.id;

    const applications = await Application.find({ studentId })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Student applications retrieved.',
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid application ID format.' });
      return;
    }

    const application = await Application.findById(id).populate('jobId');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Only the student owner or an ADMIN can view the application
    if (application.studentId.toString() !== studentId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot view another student application.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Application retrieved.',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

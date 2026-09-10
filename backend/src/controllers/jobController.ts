import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { AuthenticatedRequest } from '../types';

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, location, skills, employmentType, page = '1', limit = '10' } = req.query;

    const query: any = {};

    // Keyword search across title, company, and description
    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { company: regex },
        { description: regex },
        { requiredSkills: regex }
      ];
    }

    // Location filter
    if (location && typeof location === 'string' && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Employment type filter
    if (employmentType && typeof employmentType === 'string' && employmentType.trim()) {
      query.employmentType = employmentType.trim();
    }

    // Skills filter (e.g. skills=React,Node.js)
    if (skills && typeof skills === 'string' && skills.trim()) {
      const skillsArray = skills.split(',').map((s) => new RegExp(s.trim(), 'i'));
      query.requiredSkills = { $in: skillsArray };
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully.',
      count: total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid job ID format.' });
      return;
    }

    const job = await Job.findById(id).populate('postedBy', 'name email');

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job details retrieved.',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const { id: jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      res.status(400).json({ success: false, message: 'Invalid job ID format.' });
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    // Check application deadline
    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      res.status(400).json({
        success: false,
        message: 'The application deadline for this job has already passed.'
      });
      return;
    }

    // Check for duplicate application
    const existingApp = await Application.findOne({ studentId, jobId });
    if (existingApp) {
      res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this position.'
      });
      return;
    }

    const application = await Application.create({
      studentId,
      jobId,
      status: 'Applied'
    });

    const populatedApp = await application.populate([
      { path: 'jobId', select: 'title company location employmentType salaryRange' },
      { path: 'studentId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: populatedApp
    });
  } catch (error) {
    next(error);
  }
};

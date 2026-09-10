import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Application } from '../models/Application';
import { AuthenticatedRequest, ApplicationStatus } from '../types';

export const createJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      company,
      description,
      requiredSkills,
      location,
      employmentType,
      salaryRange,
      applicationDeadline
    } = req.body;

    if (!title || !company || !description || !requiredSkills || !location) {
      res.status(400).json({
        success: false,
        message: 'Title, company, description, required skills, and location are required.'
      });
      return;
    }

    let skillsList: string[] = requiredSkills;
    if (typeof requiredSkills === 'string') {
      skillsList = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      description,
      requiredSkills: skillsList,
      location: location.trim(),
      employmentType: employmentType || 'Full-time',
      salaryRange: salaryRange || 'Not Disclosed',
      postedBy: req.user?.id,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid job ID format.' });
      return;
    }

    const updateData: any = { ...req.body };
    if (updateData.requiredSkills && typeof updateData.requiredSkills === 'string') {
      updateData.requiredSkills = updateData.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    const job = await Job.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully.',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid job ID format.' });
      return;
    }

    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    // Also remove applications associated with this job
    await Application.deleteMany({ jobId: id });

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    // Aggregate application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const jobsWithCounts = jobs.map((job) => ({
      ...job.toObject(),
      applicationCount: countMap[job._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      message: 'Admin jobs retrieved.',
      count: jobs.length,
      data: jobsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const students = await User.find({ role: 'STUDENT' }).select('-password').sort({ createdAt: -1 });

    // Attach student profile for each student
    const studentIds = students.map((s) => s._id);
    const profiles = await StudentProfile.find({ userId: { $in: studentIds } });

    const profileMap: Record<string, any> = {};
    profiles.forEach((p) => {
      profileMap[p.userId.toString()] = p;
    });

    const result = students.map((student) => ({
      ...student.toObject(),
      profile: profileMap[student._id.toString()] || null
    }));

    res.status(200).json({
      success: true,
      message: 'Registered students retrieved.',
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId, status } = req.query;

    const query: any = {};
    if (jobId && mongoose.Types.ObjectId.isValid(jobId as string)) {
      query.jobId = jobId;
    }
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('studentId', 'name email')
      .populate('jobId', 'title company location employmentType')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Applications retrieved.',
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ApplicationStatus[] = [
      'Applied',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected'
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`
      });
      return;
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    )
      .populate('studentId', 'name email')
      .populate('jobId', 'title company');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'.`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [totalStudents, totalJobs, totalApplications, selectedCount, statusGroups, recentApplications] =
      await Promise.all([
        User.countDocuments({ role: 'STUDENT' }),
        Job.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: 'Selected' }),
        Application.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Application.find()
          .populate('studentId', 'name email')
          .populate('jobId', 'title company')
          .sort({ appliedAt: -1 })
          .limit(5)
      ]);

    const statusOverview: Record<string, number> = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0
    };

    statusGroups.forEach((group) => {
      if (group._id && statusOverview[group._id] !== undefined) {
        statusOverview[group._id] = group.count;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Admin dashboard statistics retrieved.',
      data: {
        totalStudents,
        totalJobs,
        totalApplications,
        selectedCount,
        statusOverview,
        recentApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

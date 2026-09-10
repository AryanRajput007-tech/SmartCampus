import { Response, NextFunction } from 'express';
import { StudentProfile } from '../models/StudentProfile';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    let profile = await StudentProfile.findOne({ userId }).populate('userId', 'name email role');

    if (!profile) {
      // Lazy creation if profile doesn't exist yet
      profile = await StudentProfile.create({ userId });
      profile = await profile.populate('userId', 'name email role');
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully.',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      name,
      phone,
      college,
      degree,
      graduationYear,
      skills,
      projects,
      experience,
      preferredRoles,
      resumeUrl
    } = req.body;

    // If student updated their display name, update User document
    if (name) {
      await User.findByIdAndUpdate(userId, { name: name.trim() });
    }

    // Process skills into normalized trimmed array
    let processedSkills = skills;
    if (typeof skills === 'string') {
      processedSkills = skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      processedSkills = skills.map((s: string) => String(s).trim()).filter(Boolean);
    }

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          phone,
          college,
          degree,
          graduationYear,
          skills: processedSkills,
          projects: Array.isArray(projects) ? projects : [],
          experience: Array.isArray(experience) ? experience : [],
          preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : [],
          resumeUrl
        }
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully.',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

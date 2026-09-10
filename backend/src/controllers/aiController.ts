import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Job } from '../models/Job';
import { StudentProfile } from '../models/StudentProfile';
import { AiService } from '../services/aiService';
import { AuthenticatedRequest } from '../types';

export const matchJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { jobId, skills, profileText, jobDescription, requiredSkills } = req.body;
    let targetSkills: string[] = Array.isArray(skills) ? skills : [];
    let targetProfileText: string = profileText || '';
    let targetJobDesc: string = jobDescription || '';
    let targetRequiredSkills: string[] = Array.isArray(requiredSkills) ? requiredSkills : [];

    // If student is logged in and no custom skills provided, fetch student profile
    if (req.user?.id && targetSkills.length === 0) {
      const profile = await StudentProfile.findOne({ userId: req.user.id });
      if (profile) {
        targetSkills = profile.skills || [];
        const projectSummaries = profile.projects.map((p) => `${p.title}: ${p.description}`).join('. ');
        const expSummaries = profile.experience.map((e) => `${e.role} at ${e.company}: ${e.description}`).join('. ');
        targetProfileText = `${profile.degree} at ${profile.college}. Skills: ${profile.skills.join(', ')}. Projects: ${projectSummaries}. Experience: ${expSummaries}`;
      }
    }

    // If jobId was provided, retrieve job data from database
    if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
      const job = await Job.findById(jobId);
      if (job) {
        targetRequiredSkills = job.requiredSkills;
        targetJobDesc = `${job.title} at ${job.company}. ${job.description}. Location: ${job.location}. Employment: ${job.employmentType}`;
      }
    }

    // Perform match analysis via FastAPI (or graceful fallback)
    const matchResult = await AiService.matchProfileWithJob(
      targetSkills,
      targetProfileText,
      targetRequiredSkills,
      targetJobDesc
    );

    res.status(200).json({
      success: true,
      message: 'Job matching analysis completed.',
      data: matchResult
    });
  } catch (error) {
    next(error);
  }
};

export const chatAssistant = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({
        success: false,
        message: 'Message is required.'
      });
      return;
    }

    const result = await AiService.chatWithAssistant(message.trim(), context);

    res.status(200).json({
      success: true,
      message: 'Assistant response generated.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

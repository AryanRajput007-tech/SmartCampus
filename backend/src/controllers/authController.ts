import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { config } from '../config/env';
import { AuthenticatedRequest, UserRole } from '../types';
import { isValidEmail } from '../middleware/validate';

// Generate standard JWT token with user id, email, and role
const generateToken = (id: string, email: string, role: UserRole): string => {
  return jwt.sign({ id, email, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    const assignedRole: UserRole = role === 'ADMIN' ? 'ADMIN' : 'STUDENT';

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
      return;
    }

    // Create user (password is automatically hashed in pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole
    });

    // If student, automatically initialize student profile
    if (assignedRole === 'STUDENT') {
      await StudentProfile.create({
        userId: user._id,
        phone: req.body.phone || '',
        college: req.body.college || '',
        degree: req.body.degree || '',
        graduationYear: req.body.graduationYear || new Date().getFullYear(),
        skills: req.body.skills || []
      });
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
      return;
    }

    // Explicitly select password since it is excluded by default in schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

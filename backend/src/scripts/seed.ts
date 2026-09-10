import mongoose from 'mongoose';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Job } from '../models/Job';
import { Application } from '../models/Application';
import { config } from '../config/env';

export const seedData = async (): Promise<void> => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', config.mongodbUri);
    await mongoose.connect(config.mongodbUri);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({})
    ]);

    console.log('[Seed] Creating Admin account...');
    const adminUser = await User.create({
      name: 'Campus Placement Officer',
      email: 'admin@smartcampus.edu',
      password: 'Admin@12345',
      role: 'ADMIN'
    });

    console.log('[Seed] Creating Student accounts and profiles...');
    // Student 1: Full-Stack Web
    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@smartcampus.edu',
      password: 'Student@12345',
      role: 'STUDENT'
    });

    await StudentProfile.create({
      userId: student1._id,
      phone: '+91 98765 43210',
      college: 'Institute of Engineering & Technology',
      degree: 'B.Tech in Computer Science',
      graduationYear: 2026,
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'HTML', 'CSS'],
      preferredRoles: ['Full Stack Developer', 'Frontend Developer', 'Software Engineer'],
      projects: [
        {
          title: 'Campus Event Portal',
          description: 'Built a full-stack event discovery and ticketing platform handling 500+ active student registrations.',
          technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
          link: 'https://github.com/rahul-sharma/campus-portal'
        },
        {
          title: 'CodeSync Realtime Editor',
          description: 'Collaborative code editor with syntax highlighting and room-based synchronization.',
          technologies: ['TypeScript', 'WebSocket', 'React'],
          link: 'https://github.com/rahul-sharma/codesync'
        }
      ],
      experience: [
        {
          company: 'TechCorp Digital',
          role: 'Full Stack Intern',
          duration: '3 Months (Summer 2025)',
          description: 'Developed responsive user interfaces in React and built micro-endpoints in Express with MongoDB.'
        }
      ],
      resumeUrl: 'https://example.com/resumes/rahul_sharma.pdf'
    });

    // Student 2: AI / ML
    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@smartcampus.edu',
      password: 'Student@12345',
      role: 'STUDENT'
    });

    await StudentProfile.create({
      userId: student2._id,
      phone: '+91 98765 43211',
      college: 'National Institute of Technology',
      degree: 'B.Tech in Information Technology',
      graduationYear: 2026,
      skills: ['Python', 'FastAPI', 'Machine Learning', 'Scikit-learn', 'TF-IDF', 'SQL', 'Pandas', 'NumPy'],
      preferredRoles: ['AI/ML Engineer', 'Data Scientist', 'Python Developer'],
      projects: [
        {
          title: 'Predictive Placement Analytics',
          description: 'Engineered a classification pipeline to predict student campus placement probability based on academic and project scores.',
          technologies: ['Python', 'Scikit-learn', 'FastAPI'],
          link: 'https://github.com/priya-patel/placement-predictor'
        }
      ],
      experience: [
        {
          company: 'DataSolutions AI',
          role: 'Machine Learning Research Intern',
          duration: '4 Months (Winter 2024)',
          description: 'Implemented NLP feature extraction using TF-IDF and Cosine similarity for semantic document clustering.'
        }
      ],
      resumeUrl: 'https://example.com/resumes/priya_patel.pdf'
    });

    // Student 3: Cloud / QA Automation
    const student3 = await User.create({
      name: 'Amit Verma',
      email: 'amit.verma@smartcampus.edu',
      password: 'Student@12345',
      role: 'STUDENT'
    });

    await StudentProfile.create({
      userId: student3._id,
      phone: '+91 98765 43212',
      college: 'College of Engineering & Technology',
      degree: 'B.Tech in Computer Science',
      graduationYear: 2025,
      skills: ['JavaScript', 'Python', 'Docker', 'Jest', 'Supertest', 'Postman', 'Git', 'REST APIs'],
      preferredRoles: ['QA Automation Engineer', 'Software Development Engineer', 'DevOps Associate'],
      projects: [
        {
          title: 'Automated REST API Test Suite',
          description: 'Engineered an end-to-end automated testing framework for microservices using Supertest and Jest.',
          technologies: ['JavaScript', 'Jest', 'Supertest', 'Docker'],
          link: 'https://github.com/amit-verma/api-test-suite'
        }
      ],
      experience: [],
      resumeUrl: 'https://example.com/resumes/amit_verma.pdf'
    });

    console.log('[Seed] Creating 5 Realistic Job Postings...');
    const now = new Date();
    const futureDate = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days from now

    const job1 = await Job.create({
      title: 'Full Stack Developer',
      company: 'InnoTech Solutions',
      description: 'Join our agile core engineering team building scalable web applications. You will develop modern React interfaces, write modular Express backend APIs, and design performant MongoDB schemas.',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
      location: 'Bengaluru / Remote',
      employmentType: 'Full-time',
      salaryRange: '₹8,00,000 - ₹12,00,000 / year',
      postedBy: adminUser._id,
      applicationDeadline: futureDate
    });

    const job2 = await Job.create({
      title: 'AI / ML Engineer',
      company: 'NeuralPulse AI',
      description: 'Develop and integrate practical machine learning models and NLP features into enterprise SaaS systems using Python, Scikit-learn, and FastAPI.',
      requiredSkills: ['Python', 'Machine Learning', 'Scikit-learn', 'FastAPI', 'SQL', 'REST APIs'],
      location: 'Hyderabad / Hybrid',
      employmentType: 'Full-time',
      salaryRange: '₹10,00,000 - ₹15,00,000 / year',
      postedBy: adminUser._id,
      applicationDeadline: futureDate
    });

    const job3 = await Job.create({
      title: 'Software Development Engineer (SDE-1)',
      company: 'CloudScale Systems',
      description: 'Entry-level SDE role focusing on resilient backend services, high throughput REST APIs, database indexing, and containerized deployment.',
      requiredSkills: ['JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Git'],
      location: 'Pune',
      employmentType: 'Full-time',
      salaryRange: '₹9,00,000 - ₹14,00,000 / year',
      postedBy: adminUser._id,
      applicationDeadline: futureDate
    });

    const job4 = await Job.create({
      title: 'Python Backend Developer',
      company: 'FinData Dynamics',
      description: 'Build robust asynchronous APIs and microservices for financial analytics pipelines using Python and FastAPI.',
      requiredSkills: ['Python', 'FastAPI', 'REST APIs', 'SQL', 'Docker'],
      location: 'Mumbai / Hybrid',
      employmentType: 'Full-time',
      salaryRange: '₹7,50,000 - ₹11,00,000 / year',
      postedBy: adminUser._id,
      applicationDeadline: futureDate
    });

    const job5 = await Job.create({
      title: 'QA Automation Engineer',
      company: 'QualiTech Labs',
      description: 'Design, write, and maintain automated API and integration test suites using Jest, Supertest, and CI/CD pipelines.',
      requiredSkills: ['JavaScript', 'Python', 'Jest', 'Supertest', 'Postman', 'Git'],
      location: 'Noida / Remote',
      employmentType: 'Full-time',
      salaryRange: '₹6,50,000 - ₹9,50,000 / year',
      postedBy: adminUser._id,
      applicationDeadline: futureDate
    });

    console.log('[Seed] Creating sample Applications for realistic dashboard metrics...');
    // Rahul applied for Full Stack Developer & SDE-1
    await Application.create({
      studentId: student1._id,
      jobId: job1._id,
      status: 'Shortlisted',
      appliedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    });

    await Application.create({
      studentId: student1._id,
      jobId: job3._id,
      status: 'Interview',
      appliedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    });

    // Priya applied for AI/ML Engineer
    await Application.create({
      studentId: student2._id,
      jobId: job2._id,
      status: 'Selected',
      appliedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    // Amit applied for QA Automation Engineer
    await Application.create({
      studentId: student3._id,
      jobId: job5._id,
      status: 'Applied',
      appliedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    });

    console.log('==================================================');
    console.log('✅ Database seeded successfully!');
    console.log('==================================================');
    console.log('Demo Credentials:');
    console.log('  Admin:   admin@smartcampus.edu   / Admin@12345');
    console.log('  Student: rahul.sharma@smartcampus.edu / Student@12345 (Full Stack)');
    console.log('  Student: priya.patel@smartcampus.edu  / Student@12345 (AI / ML)');
    console.log('  Student: amit.verma@smartcampus.edu   / Student@12345 (Cloud / QA)');
    console.log('==================================================');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from database.');
  }
};

if (require.main === module) {
  seedData();
}

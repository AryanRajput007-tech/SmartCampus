import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('Authentication & Authorization Suite', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new student successfully and return token and user without password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Student',
        email: 'test.student@smartcampus.edu',
        password: 'Password@123',
        role: 'STUDENT',
        college: 'Test College',
        degree: 'B.Tech',
        graduationYear: 2026
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('test.student@smartcampus.edu');
      expect(res.body.data.user.role).toBe('STUDENT');
      expect(res.body.data.user.password).toBeUndefined();

      // Verify user in database
      const userInDb = await User.findOne({ email: 'test.student@smartcampus.edu' });
      expect(userInDb).not.toBeNull();
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Invalid Email',
        email: 'invalid-email-address',
        password: 'Password@123'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with short password (< 6 chars)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'short@smartcampus.edu',
        password: '123'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('at least 6 characters');
    });

    it('should reject duplicate email registrations with 409 Conflict', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'First User',
        email: 'duplicate@smartcampus.edu',
        password: 'Password@123'
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Second User',
        email: 'duplicate@smartcampus.edu',
        password: 'Password@123'
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@smartcampus.edu',
        password: 'SecretPassword@123',
        role: 'STUDENT'
      });
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@smartcampus.edu',
        password: 'SecretPassword@123'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('login@smartcampus.edu');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@smartcampus.edu',
        password: 'WrongPassword'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should reject login for non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ghost@smartcampus.edu',
        password: 'SomePassword@123'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected Routes & Role Authorization', () => {
    let studentToken: string;
    let adminToken: string;

    beforeEach(async () => {
      const studentRes = await request(app).post('/api/auth/register').send({
        name: 'Student User',
        email: 'std@smartcampus.edu',
        password: 'Password@123',
        role: 'STUDENT'
      });
      studentToken = studentRes.body.data.token;

      const adminRes = await request(app).post('/api/auth/register').send({
        name: 'Admin User',
        email: 'adm@smartcampus.edu',
        password: 'Password@123',
        role: 'ADMIN'
      });
      adminToken = adminRes.body.data.token;
    });

    it('should allow authenticated user to fetch their own details via /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('std@smartcampus.edu');
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject student from accessing admin endpoints with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should allow admin to access admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalStudents).toBeDefined();
    });
  });
});

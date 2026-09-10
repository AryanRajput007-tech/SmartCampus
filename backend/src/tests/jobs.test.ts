import request from 'supertest';
import app from '../app';

describe('Job Management & Application Flow Suite', () => {
  let adminToken: string;
  let studentToken: string;
  let student2Token: string;
  let jobId: string;

  beforeEach(async () => {
    // Register Admin
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin Recruiter',
      email: 'recruiter@smartcampus.edu',
      password: 'AdminPassword@123',
      role: 'ADMIN'
    });
    adminToken = adminRes.body.data.token;

    // Register Student 1
    const studentRes = await request(app).post('/api/auth/register').send({
      name: 'Applicant One',
      email: 'applicant1@smartcampus.edu',
      password: 'StudentPassword@123',
      role: 'STUDENT'
    });
    studentToken = studentRes.body.data.token;

    // Register Student 2
    const student2Res = await request(app).post('/api/auth/register').send({
      name: 'Applicant Two',
      email: 'applicant2@smartcampus.edu',
      password: 'StudentPassword@123',
      role: 'STUDENT'
    });
    student2Token = student2Res.body.data.token;

    // Admin creates a job
    const jobRes = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Full Stack Engineer',
        company: 'Vanguard Technologies',
        description: 'Building modern web platforms using React and Node.js.',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        location: 'Remote',
        employmentType: 'Full-time',
        salaryRange: '₹12,00,000 / year'
      });

    jobId = jobRes.body.data._id;
  });

  it('should allow admin to create a new job successfully', async () => {
    const res = await request(app)
      .post('/api/admin/jobs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Backend Developer',
        company: 'Fintech Cloud',
        description: 'Developing high throughput financial APIs.',
        requiredSkills: ['Python', 'FastAPI', 'PostgreSQL'],
        location: 'Bengaluru',
        employmentType: 'Full-time'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Backend Developer');
    expect(res.body.data.company).toBe('Fintech Cloud');
  });

  it('should retrieve jobs with search and filter queries', async () => {
    const res = await request(app).get('/api/jobs?search=Vanguard&location=Remote');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].title).toBe('Full Stack Engineer');
  });

  it('should allow a student to apply for an active job', async () => {
    const res = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Applied');
    expect(res.body.data.jobId).toBeDefined();
  });

  it('should prevent duplicate applications for the same job with 409 Conflict', async () => {
    // First application
    await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);

    // Second application for the same job by the same student
    const duplicateRes = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toContain('already submitted an application');
  });

  it('should allow multiple different students to apply to the same job', async () => {
    const app1 = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(app1.status).toBe(201);

    const app2 = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${student2Token}`);
    expect(app2.status).toBe(201);
  });

  it('should allow student to retrieve their submitted applications', async () => {
    await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);

    const res = await request(app)
      .get('/api/applications/my')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].jobId._id.toString()).toBe(jobId);
  });

  it('should allow admin to update application status', async () => {
    const applyRes = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${studentToken}`);
    const applicationId = applyRes.body.data._id;

    const patchRes = await request(app)
      .patch(`/api/admin/applications/${applicationId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Interview' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.success).toBe(true);
    expect(patchRes.body.data.status).toBe('Interview');
  });
});

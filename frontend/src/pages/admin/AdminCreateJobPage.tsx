import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AdminCreateJobPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !description || !requiredSkills || !location) {
      setError('Please fill in all required fields (Title, Company, Description, Skills, Location).');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      await adminService.createJob({
        title,
        company,
        description,
        requiredSkills: skillsArray,
        location,
        employmentType: employmentType as any,
        salaryRange: salaryRange || undefined,
        applicationDeadline: applicationDeadline || undefined
      });

      navigate('/admin/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        ← Back to Job Openings
      </Link>

      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Create New Job Opportunity
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Publish a new opening to make it visible to students and enable AI compatibility matching.
        </p>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. SDE-1 / Full Stack Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Company Name"
              placeholder="e.g. CloudScale Systems"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Location"
              placeholder="e.g. Bengaluru, India / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-select"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Salary / CTC Range"
              placeholder="e.g. ₹9,00,000 - ₹14,00,000 / year"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
            <Input
              label="Application Deadline"
              type="date"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
            />
          </div>

          <Input
            label="Required Skills (Comma-separated keywords)"
            placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB, REST APIs"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            helperText="The AI Job Matcher evaluates these skills against student profiles."
            required
          />

          <div className="form-group">
            <label className="form-label">Job Description & Responsibilities</label>
            <textarea
              className="form-textarea"
              rows={6}
              placeholder="Provide an overview of the role, expected deliverables, and qualification requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1.5rem' }}>
            <Link to="/admin/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Publish Job Posting
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

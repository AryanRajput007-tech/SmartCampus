import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AdminEditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const job = await jobService.getJobById(id);
        setTitle(job.title);
        setCompany(job.company);
        setDescription(job.description);
        setRequiredSkills(job.requiredSkills.join(', '));
        setLocation(job.location);
        setEmploymentType(job.employmentType);
        setSalaryRange(job.salaryRange || '');
        if (job.applicationDeadline) {
          setApplicationDeadline(new Date(job.applicationDeadline).toISOString().split('T')[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSaving(true);
      setError(null);
      const skillsArray = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      await adminService.updateJob(id, {
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
      setError(err.response?.data?.message || 'Failed to update job posting.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading job opening details..." />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        ← Back to Job Openings
      </Link>

      <div className="card">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Edit Job Opportunity
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Update role requirements or compensation details.
        </p>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Job Location"
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
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            required
          />

          <div className="form-group">
            <label className="form-label">Job Description & Responsibilities</label>
            <textarea
              className="form-textarea"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3" style={{ marginTop: '1.5rem' }}>
            <Link to="/admin/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

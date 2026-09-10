import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { studentService } from '../../services/studentService';
import { Job, Application } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Button } from '../../components/Button';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);

        if (isAuthenticated && user?.role === 'STUDENT') {
          const myApps = await studentService.getMyApplications();
          const applied = myApps.some((a) => (typeof a.jobId === 'string' ? a.jobId === id : a.jobId._id === id));
          setHasApplied(applied);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load job details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!id) return;

    try {
      setIsApplying(true);
      setError(null);
      await jobService.applyForJob(id);
      setHasApplied(true);
      setSuccessMsg('Application successfully submitted! You can view the status in your applications tab.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading job opening..." />;
  if (error || !job) return <ErrorMessage message={error || 'Job not found.'} />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '900px' }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
        ← Back to all openings
      </Link>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-success-light)',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {/* Main Header Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="flex justify-between items-start gap-4" style={{ flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              {job.company}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem' }}>{job.title}</h1>
            <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span>📍 {job.location}</span>
              <span>💼 {job.employmentType}</span>
              {job.salaryRange && <span>💰 {job.salaryRange}</span>}
              {job.applicationDeadline && (
                <span>⏳ Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2" style={{ minWidth: '180px' }}>
            {user?.role === 'STUDENT' && (
              <>
                <Button
                  variant={hasApplied ? 'secondary' : 'primary'}
                  size="lg"
                  disabled={hasApplied}
                  onClick={handleApply}
                  isLoading={isApplying}
                >
                  {hasApplied ? '✓ Already Applied' : 'Apply Now'}
                </Button>

                <Link
                  to={`/ai-matcher?jobId=${job._id}`}
                  className="btn btn-outline"
                  style={{ textAlign: 'center' }}
                >
                  ⚡ Check AI Match Score
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Required Skills Chips */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Required Skills & Competencies:
          </div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {job.requiredSkills.map((skill, idx) => (
              <span key={idx} className="tag" style={{ fontSize: '0.875rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Job Description & Responsibilities
        </h3>
        <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
          {job.description}
        </div>
      </div>
    </div>
  );
};

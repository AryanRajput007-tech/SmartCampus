import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { studentService } from '../../services/studentService';
import { Job, Application } from '../../types';
import { JobCard } from '../../components/JobCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';

export const JobsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [skills, setSkills] = useState('');

  // Apply Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await jobService.getJobs({
        search: search || undefined,
        location: location || undefined,
        employmentType: employmentType || undefined,
        skills: skills || undefined
      });
      setJobs(res.jobs);

      if (isAuthenticated && user?.role === 'STUDENT') {
        const apps = await studentService.getMyApplications();
        setMyApplications(apps);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.');
    } finally {
      setIsLoading(false);
    }
  }, [search, location, employmentType, skills, isAuthenticated, user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleQuickApply = (jobId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const job = jobs.find((j) => j._id === jobId);
    if (job) {
      setSelectedJob(job);
      setApplySuccess(null);
      setApplyError(null);
    }
  };

  const confirmApplication = async () => {
    if (!selectedJob) return;
    try {
      setIsApplying(true);
      setApplyError(null);
      await jobService.applyForJob(selectedJob._id);
      setApplySuccess(`Your application for "${selectedJob.title}" at ${selectedJob.company} has been submitted!`);

      // Refresh applications list
      const apps = await studentService.getMyApplications();
      setMyApplications(apps);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  const appliedJobIds = new Set(
    myApplications.map((app) => (typeof app.jobId === 'string' ? app.jobId : app.jobId._id))
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Explore Placement Opportunities</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Discover and filter openings posted by top campus recruiters.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div className="grid grid-cols-4 gap-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="📍 Filter by location (e.g. Remote)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <select
              className="form-select"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              className="form-input"
              placeholder="⚡ Filter by skill (e.g. React)..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>

        {(search || location || employmentType || skills) && (
          <div className="flex items-center justify-between" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Active filters applied. Showing results from server query.
            </span>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setSearch('');
                setLocation('');
                setEmploymentType('');
                setSkills('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchJobs} />}

      {isLoading ? (
        <LoadingSpinner message="Searching available placement openings..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No Matching Jobs Found"
          description="Try broadening your search query or removing filters to view more opportunities."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setLocation('');
            setEmploymentType('');
            setSkills('');
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={user?.role === 'STUDENT' ? handleQuickApply : undefined}
              isApplied={appliedJobIds.has(job._id)}
            />
          ))}
        </div>
      )}

      {/* Quick Application Confirmation Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={`Apply for ${selectedJob.title}`}
        >
          {applySuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-success)' }}>
                Application Submitted!
              </h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{applySuccess}</p>
              <div className="flex justify-center gap-3">
                <Button variant="secondary" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedJob(null);
                    navigate('/my-applications');
                  }}
                >
                  View My Applications
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {applyError && <ErrorMessage message={applyError} />}

              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  You are submitting your SmartCampus profile credentials to:
                </p>
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{selectedJob.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {selectedJob.company} • 📍 {selectedJob.location}
                  </div>
                  {selectedJob.salaryRange && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                      💰 {selectedJob.salaryRange}
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Note: Duplicate submissions for the same opening are automatically blocked. You can track your status in "My Applications".
              </p>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSelectedJob(null)} disabled={isApplying}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmApplication} isLoading={isApplying}>
                  Confirm & Submit Application
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

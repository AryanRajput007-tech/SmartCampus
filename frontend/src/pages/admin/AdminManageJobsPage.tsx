import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Job } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Button } from '../../components/Button';

export const AdminManageJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${title}"? This will also remove associated applications.`)) {
      return;
    }

    try {
      await adminService.deleteJob(jobId);
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading job listings..." />;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Manage Placement Openings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create, update, or remove job opportunities available to students
          </p>
        </div>

        <Link to="/admin/jobs/create" className="btn btn-primary">
          + Post New Job
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchJobs} />}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Applicants</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td style={{ fontWeight: 600 }}>{job.title}</td>
                <td>{job.company}</td>
                <td>📍 {job.location}</td>
                <td>
                  <span className="badge badge-neutral">{job.employmentType}</span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {job.applicationCount ?? 0}
                </td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {job.applicationDeadline
                    ? new Date(job.applicationDeadline).toLocaleDateString()
                    : 'Open'}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/jobs/${job._id}/edit`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <Link
                      to={`/admin/applications?jobId=${job._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Applications ({job.applicationCount ?? 0})
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id, job.title)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No job postings created yet. Click "+ Post New Job" above to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

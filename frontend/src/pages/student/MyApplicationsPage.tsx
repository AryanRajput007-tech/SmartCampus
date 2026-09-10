import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Application } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await studentService.getMyApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (isLoading) return <LoadingSpinner message="Fetching your submitted applications..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Job Applications</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Real-time status updates from campus placement recruiters
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} />}

      {applications.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No Applications Submitted Yet"
          description="Browse the list of active campus recruitment drives and apply to positions matching your skill set."
          actionText="Explore Open Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Applied On</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 600 }}>{app.jobId?.title || 'Position'}</td>
                  <td>{app.jobId?.company || 'Recruiter'}</td>
                  <td>📍 {app.jobId?.location || 'Campus'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    {app.jobId?._id ? (
                      <Link to={`/jobs/${app.jobId._id}`} className="btn btn-secondary btn-sm">
                        View Posting
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

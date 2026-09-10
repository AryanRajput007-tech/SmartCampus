import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminDashboardStats } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await adminService.updateApplicationStatus(appId, newStatus);
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading placement dashboard analytics..." />;
  if (error || !stats) return <ErrorMessage message={error || 'Unable to retrieve statistics.'} onRetry={fetchStats} />;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Campus Recruitment Office
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.2rem' }}>Placement Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/jobs/create" className="btn btn-primary">
            + Post New Job Opening
          </Link>
          <Link to="/admin/applications" className="btn btn-secondary">
            Review All Applications
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Registered Students
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-main)' }}>
            {stats.totalStudents}
          </div>
          <Link to="/admin/students" style={{ fontSize: '0.8125rem', marginTop: '0.5rem', display: 'inline-block' }}>
            View Directory →
          </Link>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Active Job Drives
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--color-primary)' }}>
            {stats.totalJobs}
          </div>
          <Link to="/admin/jobs" style={{ fontSize: '0.8125rem', marginTop: '0.5rem', display: 'inline-block' }}>
            Manage Openings →
          </Link>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Total Applications
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--color-secondary)' }}>
            {stats.totalApplications}
          </div>
          <Link to="/admin/applications" style={{ fontSize: '0.8125rem', marginTop: '0.5rem', display: 'inline-block' }}>
            Review Pipeline →
          </Link>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Selected / Placed
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--color-success)' }}>
            {stats.selectedCount}
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'inline-block' }}>
            Campus offers confirmed
          </span>
        </div>
      </div>

      {/* Recruitment Funnel Breakdown */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Application Pipeline Status Breakdown</h3>
        <div className="grid grid-cols-5 gap-3">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Applied
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
              {stats.statusOverview.Applied || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-secondary-light)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
              Shortlisted
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
              {stats.statusOverview.Shortlisted || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-light)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' }}>
              Interview
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d97706', marginTop: '0.25rem' }}>
              {stats.statusOverview.Interview || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-success-light)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase' }}>
              Selected
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.25rem' }}>
              {stats.statusOverview.Selected || 0}
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-light)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase' }}>
              Rejected
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)', marginTop: '0.25rem' }}>
              {stats.statusOverview.Rejected || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Recent Candidate Submissions</h3>
          <Link to="/admin/applications" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            View Full Console →
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Applied Job</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Change Stage</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentApplications.map((app) => (
                <tr key={app._id}>
                  <td style={{ fontWeight: 600 }}>
                    {typeof app.studentId === 'object' ? app.studentId.name : 'Student'}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {typeof app.studentId === 'object' ? app.studentId.email : ''}
                    </div>
                  </td>
                  <td>{app.jobId?.title || 'Job Opening'}</td>
                  <td>{app.jobId?.company || 'Recruiter'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
              {stats.recentApplications.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No student applications recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Application, Job } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge';

export const AdminApplicationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getApplications({
        jobId: selectedJobId || undefined,
        status: selectedStatus || undefined
      });
      setApplications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch applications.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedJobId, selectedStatus]);

  useEffect(() => {
    const fetchJobsList = async () => {
      try {
        const jobList = await adminService.getJobs();
        setJobs(jobList);
      } catch (err) {
        console.warn('Failed to load job filter list:', err);
      }
    };
    fetchJobsList();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await adminService.updateApplicationStatus(id, newStatus);
      // Update local state smoothly
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus as any } : app))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleJobFilterChange = (val: string) => {
    setSelectedJobId(val);
    if (val) {
      setSearchParams({ jobId: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Review Applications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Recruiter evaluation pipeline: Screen candidates and transition them through recruitment stages
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Job Posting</label>
            <select
              className="form-select"
              value={selectedJobId}
              onChange={(e) => handleJobFilterChange(e.target.value)}
            >
              <option value="">All Job Openings ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} - {job.company}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Status</label>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Pipeline Stages</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchApplications} />}

      {isLoading ? (
        <LoadingSpinner message="Filtering applications..." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Target Role</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Update Stage</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {typeof app.studentId === 'object' ? app.studentId.name : 'Candidate'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {typeof app.studentId === 'object' ? app.studentId.email : ''}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{app.jobId?.title || 'Role'}</td>
                  <td>{app.jobId?.company || 'Company'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.8125rem' }}
                      value={app.status}
                      onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
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
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No applications found matching selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

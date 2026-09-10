import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { jobService } from '../../services/jobService';
import { Application, Job, StudentProfile } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ApplicationStatusBadge } from '../../components/ApplicationStatusBadge';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [profData, appsData, jobsData] = await Promise.all([
          studentService.getProfile(),
          studentService.getMyApplications(),
          jobService.getJobs({ limit: 4 })
        ]);
        setProfile(profData);
        setApplications(appsData);
        setRecentJobs(jobsData.jobs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading your placement dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  // Calculate profile completion percentage
  let completionScore = 30; // base for user account
  if (profile?.college) completionScore += 15;
  if (profile?.degree) completionScore += 15;
  if (profile?.skills && profile.skills.length > 0) completionScore += 20;
  if (profile?.projects && profile.projects.length > 0) completionScore += 10;
  if (profile?.resumeUrl) completionScore += 10;

  // Status breakdown
  const statusCounts = {
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Selected: applications.filter((a) => a.status === 'Selected').length
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          padding: '2rem'
        }}
      >
        <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
              Student Placement Portal
            </span>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>
              Welcome, {user?.name}! 👋
            </h1>
            <p style={{ color: '#e0e7ff', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              {profile?.degree || 'Undergraduate'} • {profile?.college || 'Campus Placement Drive'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', color: '#c7d2fe', marginBottom: '0.25rem' }}>
              Profile Readiness
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{completionScore}%</div>
            <div
              style={{
                width: '120px',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginTop: '0.25rem'
              }}
            >
              <div
                style={{
                  width: `${completionScore}%`,
                  height: '100%',
                  backgroundColor: '#34d399'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Applications Submitted
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-primary)' }}>
            {applications.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Across all recruiters
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Shortlisted
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-secondary)' }}>
            {statusCounts.Shortlisted}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Cleared initial screening
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Interviews Scheduled
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: '#d97706' }}>
            {statusCounts.Interview}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Technical & HR rounds
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Offers Received
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--color-success)' }}>
            {statusCounts.Selected}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
            Final selections
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
        <Link to="/ai-matcher" className="card" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>⚡</div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
            AI Job Matcher
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Compare your profile against open job descriptions to see missing skills & compatibility score.
          </p>
        </Link>

        <Link to="/ai-assistant" className="card" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🤖</div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
            AI Placement Assistant
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Get instant guidance on resume ATS formatting, DSA patterns, and behavioral STAR answers.
          </p>
        </Link>

        <Link to="/profile" className="card" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>👤</div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
            Update Profile & Skills
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Add new projects, internship experience, and technical skills to boost your AI match scores.
          </p>
        </Link>
      </div>

      {/* Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Applications Table */}
        <div className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>My Recent Applications</h3>
            <Link to="/my-applications" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              View All ({applications.length}) →
            </Link>
          </div>

          {applications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
              You haven't submitted any job applications yet. Browse open jobs to apply!
            </p>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: 500 }}>{app.jobId?.title || 'Job Posting'}</td>
                      <td>{app.jobId?.company || 'Recruiter'}</td>
                      <td>
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Available Openings */}
        <div className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Latest Opportunities</h3>
            <Link to="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Browse All Jobs →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentJobs.slice(0, 3).map((job) => (
              <div
                key={job._id}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9375rem' }}>{job.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {job.company} • {job.location}
                  </div>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { Button } from './Button';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, isApplied }) => {
  return (
    <div className="card flex flex-col justify-between" style={{ height: '100%' }}>
      <div>
        <div className="flex justify-between items-start gap-2" style={{ marginBottom: '0.75rem' }}>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {job.company}
            </span>
            <h3 style={{ fontSize: '1.2rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
          </div>
          <span className="badge badge-neutral">{job.employmentType}</span>
        </div>

        <div
          className="flex items-center gap-4"
          style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}
        >
          <span>📍 {job.location}</span>
          {job.salaryRange && <span>💰 {job.salaryRange}</span>}
          {job.applicationDeadline && (
            <span>⏳ Ends: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
          )}
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {job.description}
        </p>

        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {job.requiredSkills.slice(0, 5).map((skill, idx) => (
            <span key={idx} className="tag">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              +{job.requiredSkills.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between gap-3"
        style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}
      >
        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job._id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          <Link to={`/ai-matcher?jobId=${job._id}`} className="btn btn-outline btn-sm">
            ⚡ AI Match
          </Link>
        </div>

        {onApply && (
          <Button
            size="sm"
            variant={isApplied ? 'secondary' : 'primary'}
            disabled={isApplied}
            onClick={() => onApply(job._id)}
          >
            {isApplied ? '✓ Applied' : 'Quick Apply'}
          </Button>
        )}
      </div>
    </div>
  );
};

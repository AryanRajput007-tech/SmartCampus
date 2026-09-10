import React from 'react';
import { ApplicationStatus } from '../types';

export const ApplicationStatusBadge: React.FC<{ status: ApplicationStatus | string }> = ({ status }) => {
  let badgeClass = 'badge-neutral';
  const lower = (status || '').toLowerCase();

  switch (lower) {
    case 'applied':
      badgeClass = 'badge-applied';
      break;
    case 'shortlisted':
      badgeClass = 'badge-shortlisted';
      break;
    case 'interview':
      badgeClass = 'badge-interview';
      break;
    case 'selected':
      badgeClass = 'badge-selected';
      break;
    case 'rejected':
      badgeClass = 'badge-rejected';
      break;
    default:
      badgeClass = 'badge-neutral';
  }

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

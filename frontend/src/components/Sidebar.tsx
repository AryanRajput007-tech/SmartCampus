import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const studentLinks = [
    { to: '/student/dashboard', label: '📊 Dashboard' },
    { to: '/profile', label: '👤 My Profile' },
    { to: '/jobs', label: '💼 Browse Jobs' },
    { to: '/my-applications', label: '📝 My Applications' },
    { to: '/ai-matcher', label: '⚡ AI Job Matcher' },
    { to: '/ai-assistant', label: '🤖 Placement Assistant' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: '📈 Placement Stats' },
    { to: '/admin/jobs', label: '💼 Manage Jobs' },
    { to: '/admin/jobs/create', label: '➕ Post New Job' },
    { to: '/admin/students', label: '🎓 Registered Students' },
    { to: '/admin/applications', label: '📋 Review Applications' }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        minHeight: 'calc(100vh - 68px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div
          style={{
            padding: '0.5rem 0.75rem',
            marginBottom: '1rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isAdmin ? 'ADMINISTRATION' : 'STUDENT PORTAL'}
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--text-main)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className="card"
        style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          SmartCampus AI
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Powered by TF-IDF, Cosine Similarity & Google Gemini.
        </p>
      </div>
    </aside>
  );
};

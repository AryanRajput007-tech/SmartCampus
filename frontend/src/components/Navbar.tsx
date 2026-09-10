import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        className="container flex items-center justify-between"
        style={{ height: '68px' }}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            🎓
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Smart<span style={{ color: 'var(--color-primary)' }}>Campus</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-6" style={{ display: 'flex' }}>
          <Link to="/jobs" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
            Browse Jobs
          </Link>
          {isAuthenticated && user?.role === 'STUDENT' && (
            <>
              <Link to="/ai-matcher" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                AI Job Matcher
              </Link>
              <Link to="/ai-assistant" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                AI Placement Bot
              </Link>
            </>
          )}
        </nav>

        {/* Right Section / Auth Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                className="btn btn-secondary btn-sm"
              >
                Dashboard
              </Link>
              <span className={`badge ${user.role === 'ADMIN' ? 'badge-interview' : 'badge-applied'}`}>
                {user.role}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Sign out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

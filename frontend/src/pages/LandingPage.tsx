import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container flex flex-col items-center" style={{ textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 'var(--radius-full)',
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✨</span> Next-Gen Placement Management with Explainable AI
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              color: '#ffffff',
              maxWidth: '850px',
              marginBottom: '1.5rem',
              lineHeight: 1.15
            }}
          >
            Streamline College Placements with Intelligent Job Matching
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#c7d2fe',
              maxWidth: '650px',
              marginBottom: '2.5rem',
              lineHeight: 1.6
            }}
          >
            A full-stack placement portal connecting students and recruiters. Powered by
            TF-IDF cosine similarity, skill gap recommendations, and Gemini-assisted interview prep.
          </p>

          <div className="flex items-center gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {isAuthenticated ? (
              <Link
                to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                className="btn btn-primary btn-lg"
                style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }}
              >
                Go to Your Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  Create Student Account
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.6)', color: '#ffffff' }}
                >
                  Sign In
                </Link>
              </>
            )}
            <Link
              to="/jobs"
              className="btn btn-secondary btn-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              Browse Active Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Credentials Alert Banner */}
      <section style={{ backgroundColor: 'var(--color-primary-light)', padding: '1.5rem 0', borderBottom: '1px solid #c7d2fe' }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>💡 Demo Credentials Available:</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginLeft: '0.5rem' }}>
              Admin: <code>admin@smartcampus.edu</code> (Admin@12345) | Student: <code>rahul.sharma@smartcampus.edu</code> (Student@12345)
            </span>
          </div>
          <Link to="/login" className="btn btn-primary btn-sm">
            Quick Auto-Fill Login
          </Link>
        </div>
      </section>

      {/* Key Architectural Pillars */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.875rem' }}>
              Full-Stack Architecture
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>
              Built for Modern Software Engineering Standards
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Engineered with clean separation of concerns, robust REST APIs, explainable AI algorithms, and responsive interfaces.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Explainable AI Matching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Combines direct skill set intersection with TF-IDF and Cosine similarity via a dedicated Python FastAPI service to compute compatibility scores (0–100%).
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>JWT & Role Authorization</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Secured endpoints with bcrypt password hashing, stateless JSON Web Tokens, and granular role gates separating Student and Admin capabilities.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Placement Assistant</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Integrated Google Gemini placement bot delivering resume feedback, coding interview preparation, and STAR behavioral frameworks with automatic offline fallback.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>💼</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Duplicate-Free Applications</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Database-level compound unique indexing prevents students from applying twice for the same opening, with transparent status progression tracking.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Server-Side Search & Filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Fast query filtering by title, company, skills, and employment type implemented directly in the Express backend using regex and indexing.
              </p>
            </div>

            <div className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Admin Placement Analytics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Real-time dashboard summarizing total candidates, active openings, status distributions (Shortlisted, Interview, Selected), and applicant reviews.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          padding: '2rem 0',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}
      >
        <div className="container">
          <p>© {new Date().getFullYear()} SmartCampus – Full Stack Placement Management & AI Assistant</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-subtle)' }}>
            Engineered with React, TypeScript, Node.js, Express, MongoDB, and Python FastAPI.
          </p>
        </div>
      </footer>
    </div>
  );
};

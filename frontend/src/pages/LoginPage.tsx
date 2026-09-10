import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorMessage } from '../components/ErrorMessage';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login({ email, password });

      // Check user role from storage or navigate based on role
      const stored = localStorage.getItem('smartcampus_user');
      const user = stored ? JSON.parse(stored) : null;

      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sign in to access your placement dashboard
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rahul.sharma@smartcampus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            Quick Demo Auto-Fill:
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
              onClick={() => fillDemo('admin@smartcampus.edu', 'Admin@12345')}
            >
              <span>👤 Admin Recruiter</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>admin@smartcampus.edu</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
              onClick={() => fillDemo('rahul.sharma@smartcampus.edu', 'Student@12345')}
            >
              <span>🎓 Student (Rahul - Full Stack)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>rahul.sharma@...</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
              onClick={() => fillDemo('priya.patel@smartcampus.edu', 'Student@12345')}
            >
              <span>🤖 Student (Priya - AI/ML)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>priya.patel@...</span>
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

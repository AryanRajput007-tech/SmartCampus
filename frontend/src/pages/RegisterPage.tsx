import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorMessage } from '../components/ErrorMessage';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech in Computer Science');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, MongoDB');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Name, email, and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

      await register({
        name,
        email,
        password,
        role,
        college,
        degree,
        graduationYear: 2026,
        skills: skillsArray
      });

      if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Register on SmartCampus to explore opportunities & AI career matching
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Register As</label>
            <div className="flex gap-4" style={{ marginTop: '0.25rem' }}>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                />
                Student Applicant
              </label>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === 'ADMIN'}
                  onChange={() => setRole('ADMIN')}
                />
                Placement Admin / Recruiter
              </label>
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {role === 'STUDENT' && (
            <>
              <Input
                label="College / Institute"
                placeholder="e.g. Institute of Engineering & Technology"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />

              <Input
                label="Degree / Major"
                placeholder="e.g. B.Tech in Computer Science"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />

              <Input
                label="Key Skills (comma separated)"
                placeholder="e.g. React, Node.js, Python, SQL"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                helperText="These skills will be matched against job postings by our AI service."
              />
            </>
          )}

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }} isLoading={isLoading}>
            Complete Registration
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Already registered? <Link to="/login" style={{ fontWeight: 600 }}>Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

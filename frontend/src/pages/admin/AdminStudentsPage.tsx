import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<(User & { profile?: any })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch student directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesName = s.name.toLowerCase().includes(term);
    const matchesEmail = s.email.toLowerCase().includes(term);
    const matchesCollege = s.profile?.college?.toLowerCase().includes(term);
    const matchesSkill = s.profile?.skills?.some((sk: string) => sk.toLowerCase().includes(term));
    return matchesName || matchesEmail || matchesCollege || matchesSkill;
  });

  if (isLoading) return <LoadingSpinner message="Loading registered student profiles..." />;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Student Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Browse registered candidate profiles, academic backgrounds, and verified technical skill sets
          </p>
        </div>

        <div style={{ width: '320px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search candidate name, skill, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStudents} />}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email / Phone</th>
              <th>College & Degree</th>
              <th>Graduation</th>
              <th>Key Skills</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id || student.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{student.name}</div>
                  <span className="badge badge-applied" style={{ fontSize: '0.65rem' }}>
                    Student
                  </span>
                </td>
                <td>
                  <div>{student.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {student.profile?.phone || 'No phone provided'}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{student.profile?.college || 'Campus Candidate'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {student.profile?.degree || 'Undergraduate'}
                  </div>
                </td>
                <td>{student.profile?.graduationYear || '2026'}</td>
                <td>
                  <div className="flex gap-1" style={{ flexWrap: 'wrap', maxWidth: '280px' }}>
                    {student.profile?.skills?.map((skill: string, idx: number) => (
                      <span key={idx} className="tag" style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}>
                        {skill}
                      </span>
                    )) || <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>}
                  </div>
                </td>
                <td>
                  {student.profile?.resumeUrl ? (
                    <a
                      href={student.profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      📄 View CV
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Not uploaded</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No students found matching your search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

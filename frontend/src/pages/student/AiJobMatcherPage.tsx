import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import { jobService } from '../../services/jobService';
import { studentService } from '../../services/studentService';
import { Job, MatchResult } from '../../types';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AiJobMatcherPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);

  // Custom or prefilled inputs
  const [studentSkills, setStudentSkills] = useState<string>('');
  const [requiredSkills, setRequiredSkills] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');

  const [result, setResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsInitializing(true);
        const [jobsData, profileData] = await Promise.all([
          jobService.getJobs({ limit: 50 }),
          studentService.getProfile()
        ]);
        setAvailableJobs(jobsData.jobs);

        if (profileData?.skills) {
          setStudentSkills(profileData.skills.join(', '));
        }

        // If an initial job was passed via query parameter
        if (initialJobId) {
          const target = jobsData.jobs.find((j) => j._id === initialJobId);
          if (target) {
            setSelectedJobId(target._id);
            setRequiredSkills(target.requiredSkills.join(', '));
            setJobDescription(target.description);
          }
        }
      } catch (err: any) {
        console.warn('Failed to prefill matcher inputs:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    initData();
  }, [initialJobId]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    if (!jobId) {
      setRequiredSkills('');
      setJobDescription('');
      return;
    }
    const job = availableJobs.find((j) => j._id === jobId);
    if (job) {
      setRequiredSkills(job.requiredSkills.join(', '));
      setJobDescription(job.description);
    }
  };

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const parsedStudentSkills = studentSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedRequiredSkills = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const matchData = await aiService.matchJob({
        jobId: selectedJobId || undefined,
        skills: parsedStudentSkills,
        requiredSkills: parsedRequiredSkills,
        jobDescription: jobDescription
      });

      setResult(matchData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error executing AI match analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) return <LoadingSpinner message="Initializing AI Job Matcher..." />;

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-primary)';
    if (score >= 40) return '#d97706';
    return 'var(--color-danger)';
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>⚡ AI Job Compatibility Matcher</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          TF-IDF Vectorization, Cosine Semantic Similarity, and Keyword Overlap analysis.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
        {/* Form Inputs */}
        <div className="card">
          <form onSubmit={handleRunMatch}>
            <div className="form-group">
              <label className="form-label">Select from Active Jobs (Optional)</label>
              <select
                className="form-select"
                value={selectedJobId}
                onChange={(e) => handleJobSelect(e.target.value)}
              >
                <option value="">-- Or paste custom job requirements below --</option>
                {availableJobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} at {job.company} ({job.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Skills (Comma Separated)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. React, TypeScript, Node.js, Express, MongoDB, REST APIs"
                value={studentSkills}
                onChange={(e) => setStudentSkills(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Automatically pre-filled from your student profile.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills for Job (Comma Separated)</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Python, FastAPI, Docker, SQL, Machine Learning"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description / Responsibilities</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Paste the full job posting text for TF-IDF contextual similarity analysis..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} isLoading={isLoading}>
              ⚡ Run AI Compatibility Analysis
            </Button>
          </form>
        </div>

        {/* Results Visualization */}
        <div>
          {isLoading && <LoadingSpinner message="Calculating TF-IDF vectors & cosine similarity..." />}

          {!isLoading && !result && (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                borderStyle: 'dashed',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Awaiting Analysis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Select an open position or paste your target job details on the left and click "Run AI Compatibility Analysis".
              </p>
            </div>
          )}

          {!isLoading && result && (
            <div className="card" style={{ boxShadow: 'var(--shadow-md)' }}>
              {/* Score Header */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  AI Compatibility Score
                </div>
                <div
                  style={{
                    fontSize: '4.5rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    margin: '0.5rem 0',
                    color: getScoreColor(result.match_score)
                  }}
                >
                  {result.match_score}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Combined Direct Keyword Overlap (60%) + TF-IDF Cosine Similarity (40%)
                </div>
              </div>

              {/* Matched Skills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                  ✓ Matched Skills ({result.matched_skills.length})
                </div>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {result.matched_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="tag"
                      style={{
                        backgroundColor: 'var(--color-success-light)',
                        color: 'var(--color-success)',
                        borderColor: '#a7f3d0'
                      }}
                    >
                      ✓ {skill}
                    </span>
                  ))}
                  {result.matched_skills.length === 0 && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      No exact keyword matches found.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: '0.5rem' }}>
                  ✕ Missing Skills / Skill Gaps ({result.missing_skills.length})
                </div>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {result.missing_skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="tag"
                      style={{
                        backgroundColor: 'var(--color-danger-light)',
                        color: 'var(--color-danger)',
                        borderColor: '#fecaca'
                      }}
                    >
                      ✕ {skill}
                    </span>
                  ))}
                  {result.missing_skills.length === 0 && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-success)' }}>
                      Great job! You satisfy all required skill keywords for this role.
                    </span>
                  )}
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid #c7d2fe',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.6
                }}
              >
                <strong>💡 AI Recommendation:</strong>
                <div style={{ marginTop: '0.25rem' }}>{result.recommendation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

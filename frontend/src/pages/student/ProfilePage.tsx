import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { StudentProfile, Project, Experience } from '../../types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [resumeUrl, setResumeUrl] = useState('');

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', link: '' });

  // Experience
  const [experience, setExperience] = useState<Experience[]>([]);
  const [newExp, setNewExp] = useState<Experience>({ company: '', role: '', duration: '', description: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await studentService.getProfile();
        setProfile(data);
        setName(user?.name || '');
        setPhone(data.phone || '');
        setCollege(data.college || '');
        setDegree(data.degree || '');
        setGraduationYear(data.graduationYear || 2026);
        setResumeUrl(data.resumeUrl || '');
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setExperience(data.experience || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddProject = () => {
    if (!newProject.title.trim() || !newProject.description.trim()) return;
    setProjects([...projects, { ...newProject }]);
    setNewProject({ title: '', description: '', link: '' });
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, idx) => idx !== index));
  };

  const handleAddExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    setExperience([...experience, { ...newExp }]);
    setNewExp({ company: '', role: '', duration: '', description: '' });
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      await studentService.updateProfile({
        name,
        phone,
        college,
        degree,
        graduationYear,
        resumeUrl,
        skills,
        projects,
        experience
      });

      await refreshUser();
      setSuccessMessage('Profile updated successfully! AI matcher will now use your latest skills.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading profile..." />;

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Student Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Keep your academic and project credentials up to date for campus recruiters
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-success-light)',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontWeight: 500
          }}
        >
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Basic & Academic Info */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            🎓 Academic & Contact Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
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
              label="Graduation Year"
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(parseInt(e.target.value, 10) || 2026)}
            />
            <Input
              label="Resume Link (Google Drive / GitHub / PDF)"
              placeholder="https://example.com/my-resume.pdf"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Technical Skills */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            ⚡ Technical Skills (Used in AI Job Matching)
          </h3>

          <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1 }}
              placeholder="Add a technical skill (e.g. React, TypeScript, Docker, SQL)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddSkill}>
              + Add Skill
            </Button>
          </div>

          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="tag"
                style={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderColor: '#c7d2fe',
                  paddingRight: '0.375rem'
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    marginLeft: '0.5rem',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No skills added yet. Add key technologies you know to improve your job match score!
              </p>
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            💻 Projects Portfolio
          </h3>

          <div className="flex flex-col gap-3" style={{ marginBottom: '1.5rem' }}>
            {projects.map((proj, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{proj.title}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {proj.description}
                </p>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                    🔗 {proj.link}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>+ Add New Project</h4>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '0.75rem' }}>
              <Input
                placeholder="Project Title (e.g. SmartCampus)"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              />
              <Input
                placeholder="Project URL / GitHub Repo"
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              />
            </div>
            <textarea
              className="form-textarea"
              placeholder="Describe what the project accomplishes, technologies used, and your individual impact..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              style={{ marginBottom: '0.75rem' }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddProject}>
              Add Project to Profile
            </Button>
          </div>
        </div>

        {/* Work Experience */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            🏢 Work / Internship Experience
          </h3>

          <div className="flex flex-col gap-3" style={{ marginBottom: '1.5rem' }}>
            {experience.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {exp.role} @ {exp.company}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
                {exp.duration && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.duration}</span>
                )}
                {exp.description && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>+ Add Work / Internship Experience</h4>
            <div className="grid grid-cols-3 gap-3" style={{ marginBottom: '0.75rem' }}>
              <Input
                placeholder="Company Name"
                value={newExp.company}
                onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              />
              <Input
                placeholder="Job Role (e.g. SDE Intern)"
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              />
              <Input
                placeholder="Duration (e.g. 3 Months)"
                value={newExp.duration}
                onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
              />
            </div>
            <textarea
              className="form-textarea"
              placeholder="Summarize key responsibilities, tools, and deliverables..."
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
              style={{ marginBottom: '0.75rem' }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddExperience}>
              Add Experience to Profile
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

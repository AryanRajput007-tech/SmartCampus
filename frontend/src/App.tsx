import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobsPage } from './pages/student/JobsPage';
import { JobDetailsPage } from './pages/student/JobDetailsPage';

// Student Pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { AiJobMatcherPage } from './pages/student/AiJobMatcherPage';
import { AiPlacementAssistantPage } from './pages/student/AiPlacementAssistantPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminManageJobsPage } from './pages/admin/AdminManageJobsPage';
import { AdminCreateJobPage } from './pages/admin/AdminCreateJobPage';
import { AdminEditJobPage } from './pages/admin/AdminEditJobPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Standard Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Route>

      {/* Student Portal Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="/ai-matcher" element={<AiJobMatcherPage />} />
        <Route path="/ai-assistant" element={<AiPlacementAssistantPage />} />
      </Route>

      {/* Admin Portal Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/jobs" element={<AdminManageJobsPage />} />
        <Route path="/admin/jobs/create" element={<AdminCreateJobPage />} />
        <Route path="/admin/jobs/:id/edit" element={<AdminEditJobPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/applications" element={<AdminApplicationsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

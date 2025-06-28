import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import SubjectWorkspacePage from './pages/SubjectWorkspacePage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/subject/:subjectId" element={<SubjectWorkspacePage />} />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App; 
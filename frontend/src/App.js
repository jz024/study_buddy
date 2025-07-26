import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import SubjectWorkspacePage from './pages/SubjectWorkspacePage';
import OnboardingSurveyPage from './pages/OnboardingSurveyPage';
import UserProfilePage from './pages/UserProfilePage';

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
      <Route path="/onboarding-survey" element={<OnboardingSurveyPage />} />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App; 
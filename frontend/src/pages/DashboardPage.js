import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  useTheme
} from '@mui/material';
import {
  ExitToApp,
  School,
  Chat,
  Quiz,
  Psychology
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                AI Study Buddy
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="body1">
                {currentUser?.displayName || 'User'}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Learner'}! 🎉
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to continue your learning journey?
          </Typography>
        </Paper>

        {/* Status Section */}
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Your Account Status
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Email:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {currentUser?.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Account Status:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                ✅ Active
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">Member Since:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {currentUser?.metadata?.creationTime ? 
                  new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                  'Recently'
                }
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage; 
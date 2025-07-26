import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  School,
  ExitToApp,
  Chat,
  Quiz,
  Psychology
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllSubjects, isSubjectAISupported } from '../data/subjectConfigs';

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

  const handleSubjectClick = (subject) => {
    // Navigate to subject workspace page
    navigate(`/subject/${subject.id}`);
  };

  const subjects = getAllSubjects();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2, boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                AI Study Buddy
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateY(-1px)'
                  }
                }}
                onClick={() => navigate('/profile')}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </Avatar>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    '&:hover': {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome back, {currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'Learner'}!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Choose a subject to start your learning journey
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip label={`${subjects.length} Subjects Available`} color="primary" variant="outlined" />
                <Chip label="AI-Powered Learning" color="secondary" variant="outlined" />
                <Chip label="Personalized Experience" color="success" variant="outlined" />
              </Box>
            </Paper>
          </motion.div>

          {/* Subjects Grid */}
          <motion.div variants={itemVariants}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Available Subjects
            </Typography>
          </motion.div>

          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {subjects.map((subject, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={subject.id} sx={{ display: 'flex' }}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%' }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      minHeight: 280,
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: `linear-gradient(135deg, ${alpha(subject.color, 0.1)} 0%, ${alpha(subject.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(subject.color, 0.2)}`,
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: `0 8px 25px ${alpha(subject.color, 0.3)}`,
                        transform: 'translateY(-8px)',
                        border: `2px solid ${alpha(subject.color, 0.4)}`
                      }
                    }}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: alpha(subject.color, 0.1),
                            mb: 2,
                            border: `2px solid ${alpha(subject.color, 0.3)}`
                          }}
                        >
                          <Typography variant="h3" sx={{ color: subject.color }}>
                            {subject.icon}
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: subject.color }}>
                          {subject.name}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {subject.description}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                          {subject.topics.slice(0, 2).map((topic, idx) => (
                            <Chip
                              key={idx}
                              label={topic}
                              size="small"
                              sx={{
                                bgcolor: alpha(subject.color, 0.1),
                                color: subject.color,
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                          {subject.topics.length > 2 && (
                            <Chip
                              label={`+${subject.topics.length - 2} more`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        
                        {isSubjectAISupported(subject.id) ? (
                          <Chip
                            label="AI Ready"
                            color="success"
                            size="small"
                            sx={{ fontSize: '0.7rem', alignSelf: 'center' }}
                          />
                        ) : (
                          <Chip
                            label="Coming Soon"
                            color="warning"
                            size="small"
                            sx={{ fontSize: '0.7rem', alignSelf: 'center' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Chat />}
                  sx={{ borderRadius: 2 }}
                >
                  Ask AI Assistant
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Quiz />}
                  sx={{ borderRadius: 2 }}
                >
                  Take Practice Quiz
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Psychology />}
                  sx={{ borderRadius: 2 }}
                >
                  Review Flashcards
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DashboardPage; 
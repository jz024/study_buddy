import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Psychology,
  Upload,
  Quiz,
  Chat,
  TrendingUp
} from '@mui/icons-material';
import AskQuestionDemo from '../components/common/AskQuestionDemo';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload />,
      title: 'Document Upload',
      description: 'Upload PDF and DOCX files to create comprehensive study materials automatically.'
    },
    {
      icon: <Chat />,
      title: 'AI Study Assistant',
      description: 'Get instant answers and explanations on any topic with our intelligent chat system.'
    },
    {
      icon: <Psychology />,
      title: 'Smart Flashcards',
      description: 'AI-generated flashcards with spaced repetition to optimize your learning retention.'
    },
    {
      icon: <Quiz />,
      title: 'Adaptive Quizzes',
      description: 'Personalized quizzes that adapt to your learning progress and identify weak areas.'
    },
    {
      icon: <School />,
      title: 'Subject Organization',
      description: 'Organize your studies by subjects with color-coded categories and progress tracking.'
    },
    {
      icon: <TrendingUp />,
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed analytics and performance insights.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: '#ffffff',
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 700,
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              AI Study Buddy
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' }
              }}
            >
              Revolutionize your learning with AI-powered study tools, intelligent flashcards, and personalized quizzes
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#ffffff',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ffffff',
                    bgcolor: alpha('#ffffff', 0.1),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: theme.palette.primary.main
              }}
            >
              Powerful Features for Smart Learning
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Everything you need to transform your study sessions and accelerate your learning
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: '50%',
                        width: 80,
                        height: 80,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 40, color: theme.palette.primary.main }
                      })}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Ask Question Demo Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                mb: 3,
                color: theme.palette.primary.main
              }}
            >
              Try Our AI Study Assistant
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Experience the power of AI-powered learning with our interactive demo
            </Typography>
          </Box>
          <AskQuestionDemo />
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: '#ffffff'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 3
              }}
            >
              Ready to Transform Your Learning?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join thousands of students who are already learning smarter with AI Study Buddy
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: '#ffffff',
                color: theme.palette.primary.main,
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              Start Learning Today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 
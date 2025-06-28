import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Psychology,
  Upload,
  Quiz,
  Chat,
  TrendingUp,
  ArrowDownward,
  PlayArrow
} from '@mui/icons-material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import AskQuestionDemo from '../components/common/AskQuestionDemo';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  // Parallax effect for hero section
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Upload />,
      title: 'Document Upload',
      description: 'Upload PDF and DOCX files to create comprehensive study materials automatically.',
      color: '#FF6B6B'
    },
    {
      icon: <Chat />,
      title: 'AI Study Assistant',
      description: 'Get instant answers and explanations on any topic with our intelligent chat system.',
      color: '#4ECDC4'
    },
    {
      icon: <Psychology />,
      title: 'Smart Flashcards',
      description: 'AI-generated flashcards with spaced repetition to optimize your learning retention.',
      color: '#45B7D1'
    },
    {
      icon: <Quiz />,
      title: 'Adaptive Quizzes',
      description: 'Personalized quizzes that adapt to your learning progress and identify weak areas.',
      color: '#96CEB4'
    },
    {
      icon: <School />,
      title: 'Subject Organization',
      description: 'Organize your studies by subjects with color-coded categories and progress tracking.',
      color: '#FFEAA7'
    },
    {
      icon: <TrendingUp />,
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed analytics and performance insights.',
      color: '#DDA0DD'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // More dynamic background animations
  const dynamicFloatingAnimation = {
    y: [0, -30, 0],
    x: [0, 20, 0],
    rotate: [0, 180, 360],
    scale: [1, 1.2, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.3, 1],
    opacity: [0.3, 0.7, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const waveAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Even more dynamic animations
  const spiralAnimation = {
    y: [0, -40, 0],
    x: [0, 30, -30, 0],
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 1.4, 0.8, 1.2, 1],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const bounceAnimation = {
    y: [0, -25, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const zigzagAnimation = {
    y: [0, -20, 0, -10, 0],
    x: [0, 15, 0, -15, 0],
    rotate: [0, 15, 0, -15, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const glowAnimation = {
    scale: [1, 1.5, 1],
    opacity: [0.2, 0.8, 0.2],
    boxShadow: [
      '0 0 20px rgba(255, 255, 255, 0.3)',
      '0 0 40px rgba(255, 255, 255, 0.6)',
      '0 0 20px rgba(255, 255, 255, 0.3)'
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <motion.div
        style={{
          y: heroY,
          opacity: heroOpacity
        }}
      >
        <Box
          sx={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
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
          {/* Enhanced animated background elements */}
          <motion.div
            animate={dynamicFloatingAnimation}
            style={{
              position: 'absolute',
              top: '15%',
              left: '8%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              ...pulseAnimation,
              transition: { ...pulseAnimation.transition, delay: 1 }
            }}
            style={{
              position: 'absolute',
              top: '25%',
              right: '12%',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={waveAnimation}
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '15%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              ...dynamicFloatingAnimation,
              transition: { ...dynamicFloatingAnimation.transition, delay: 2, duration: 10 }
            }}
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '8%',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 90, 180, 270, 360],
              transition: { duration: 12, repeat: Infinity, ease: "linear" }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
              transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 0
            }}
          />

          {/* Additional dynamic elements */}
          <motion.div
            animate={spiralAnimation}
            style={{
              position: 'absolute',
              top: '10%',
              right: '20%',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.08))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={bounceAnimation}
            style={{
              position: 'absolute',
              top: '35%',
              left: '5%',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={zigzagAnimation}
            style={{
              position: 'absolute',
              bottom: '35%',
              right: '25%',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.07))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={glowAnimation}
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              ...spiralAnimation,
              transition: { ...spiralAnimation.transition, delay: 3, duration: 18 }
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '25%',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, -25, 0],
              rotate: [0, -180, -360],
              scale: [1, 1.3, 1],
              transition: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }
            }}
            style={{
              position: 'absolute',
              top: '45%',
              right: '5%',
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04))',
              zIndex: 0
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                      fontWeight: 800,
                      mb: 3,
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      background: 'linear-gradient(45deg, #1E40AF 0%, #3B82F6 20%, #60A5FA 40%, #93C5FD 60%, #BFDBFE 80%, #DBEAFE 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradientShift 2s ease-in-out infinite',
                      filter: 'brightness(1.4) contrast(1.2)',
                      '@keyframes gradientShift': {
                        '0%': {
                          backgroundPosition: '0% 50%'
                        },
                        '50%': {
                          backgroundPosition: '100% 50%'
                        },
                        '100%': {
                          backgroundPosition: '0% 50%'
                        }
                      }
                    }}
                  >
                    AI Study Buddy
                  </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 6, 
                      opacity: 0.9,
                      maxWidth: '700px',
                      mx: 'auto',
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      fontWeight: 300,
                      lineHeight: 1.4
                    }}
                  >
                    Your personal AI-powered learning companion that transforms how you study
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => navigate('/register')}
                        startIcon={<PlayArrow />}
                        sx={{ 
                          bgcolor: '#ffffff',
                          color: theme.palette.primary.main,
                          px: 5,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: '50px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          '&:hover': {
                            bgcolor: alpha('#ffffff', 0.9),
                            boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
                          }
                        }}
                      >
                        Get Started Free
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button 
                        variant="outlined" 
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ 
                          borderColor: '#ffffff',
                          borderWidth: 2,
                          color: '#ffffff',
                          px: 5,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: '50px',
                          '&:hover': {
                            borderColor: '#ffffff',
                            bgcolor: alpha('#ffffff', 0.1),
                            borderWidth: 2
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ marginTop: '4rem' }}
                >
                  <ArrowDownward sx={{ fontSize: 40, opacity: 0.7 }} />
                </motion.div>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </motion.div>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                  sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.2rem' }}
                >
                  Everything you need to transform your study sessions and accelerate your learning journey
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: theme.shadows[15]
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Box 
                            sx={{ 
                              background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                              borderRadius: '50%',
                              width: 100,
                              height: 100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 3,
                              boxShadow: `0 8px 25px ${alpha(feature.color, 0.3)}`
                            }}
                          >
                            {React.cloneElement(feature.icon, {
                              sx: { fontSize: 50, color: '#ffffff' }
                            })}
                          </Box>
                        </motion.div>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 3,
                    color: theme.palette.primary.main
                  }}
                >
                  How It Works
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.2rem' }}
                >
                  Three simple steps to revolutionize your learning experience
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={6} alignItems="center">
              {[
                {
                  step: '01',
                  title: 'Upload Your Materials',
                  description: 'Simply upload your PDF documents, lecture notes, or any study materials you want to work with.',
                  icon: <Upload sx={{ fontSize: 60 }} />
                },
                {
                  step: '02',
                  title: 'AI Processes Everything',
                  description: 'Our advanced AI analyzes your content and creates personalized study materials, flashcards, and quizzes.',
                  icon: <Psychology sx={{ fontSize: 60 }} />
                },
                {
                  step: '03',
                  title: 'Study Smarter',
                  description: 'Access your personalized learning tools, track your progress, and improve your retention with AI-powered insights.',
                  icon: <TrendingUp sx={{ fontSize: 60 }} />
                }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Box 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: '50%',
                          width: 120,
                          height: 120,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          position: 'relative'
                        }}
                      >
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            bgcolor: theme.palette.primary.main,
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 700
                          }}
                        >
                          {step.step}
                        </Typography>
                        <Box sx={{ color: theme.palette.primary.main }}>
                          {step.icon}
                        </Box>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Ask Question Demo Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
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
                  sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.2rem' }}
                >
                  Experience the power of AI-powered learning with our interactive demo
                </Typography>
              </Box>
            </motion.div>
            <motion.div variants={itemVariants}>
              <AskQuestionDemo />
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={floatingAnimation}
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }}
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1.5 }
          }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 0
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 3
                  }}
                >
                  Ready to Transform Your Learning?
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ mb: 6, opacity: 0.9, lineHeight: 1.5 }}
                >
                  Join thousands of students who are already learning smarter with AI Study Buddy
                </Typography>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/register')}
                    startIcon={<PlayArrow />}
                    sx={{ 
                      bgcolor: '#ffffff',
                      color: theme.palette.primary.main,
                      px: 6,
                      py: 2.5,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: alpha('#ffffff', 0.9),
                        boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    Start Learning Today
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 
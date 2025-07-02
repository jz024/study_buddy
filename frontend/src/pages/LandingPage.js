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
  PlayArrow,
  AutoAwesome,
  Lightbulb,
  RocketLaunch
} from '@mui/icons-material';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import AskQuestionDemo from '../components/AskQuestionDemo';

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
      title: 'Smart Document Processing',
      description: 'Upload any study material and watch AI transform it into comprehensive learning resources.',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Chat />,
      title: 'Intelligent Study Assistant',
      description: 'Get instant, contextual answers and explanations with our advanced AI conversation system.',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <Psychology />,
      title: 'Adaptive Learning Engine',
      description: 'AI-generated flashcards with intelligent spacing that adapts to your learning patterns.',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <Quiz />,
      title: 'Personalized Assessment',
      description: 'Dynamic quizzes that evolve based on your performance and learning objectives.',
      color: '#43e97b',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: <School />,
      title: 'Organized Knowledge Hub',
      description: 'Beautifully organized study spaces with intelligent categorization and progress tracking.',
      color: '#fa709a',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: <TrendingUp />,
      title: 'Advanced Analytics',
      description: 'Deep insights into your learning journey with predictive analytics and performance trends.',
      color: '#a8edea',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.95
    }
  };

  // Enhanced floating animations
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const dynamicFloatingAnimation = {
    y: [0, -40, 0],
    x: [0, 30, 0],
    rotate: [0, 180, 360],
    scale: [1, 1.3, 1],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.4, 1],
    opacity: [0.2, 0.6, 0.2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const waveAnimation = {
    y: [0, -25, 0],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const spiralAnimation = {
    y: [0, -50, 0],
    x: [0, 40, -40, 0],
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 1.5, 0.8, 1.3, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const glowAnimation = {
    scale: [1, 1.6, 1],
    opacity: [0.1, 0.8, 0.1],
    boxShadow: [
      '0 0 30px rgba(255, 255, 255, 0.2)',
      '0 0 60px rgba(255, 255, 255, 0.8)',
      '0 0 30px rgba(255, 255, 255, 0.2)'
    ],
    transition: {
      duration: 4,
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
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 25%, rgba(240, 147, 251, 0.8) 50%, rgba(245, 87, 108, 0.8) 75%, rgba(79, 172, 254, 0.8) 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
          color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
            '@keyframes gradientShift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M40 40v-8h-4v8h-8v4h8v8h4v-8h8v-4h-8zm0-40V0h-4v8h-8v4h8v8h4V12h8V8h-8zM8 40v-8H0v8H0v4h8v8h4v-8h8v-4H8zM8 8V0H0v8H0v4h8v8h4V12h8V8H8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }
          }}
        >
          {/* Enhanced animated background elements */}
          <motion.div
            animate={dynamicFloatingAnimation}
            style={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03))',
              backdropFilter: 'blur(10px)',
              zIndex: 0
            }}
          />
          <motion.div
            animate={{
              ...pulseAnimation,
              transition: { ...pulseAnimation.transition, delay: 2 }
            }}
            style={{
              position: 'absolute',
              top: '20%',
              right: '8%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(15px)',
              zIndex: 0
            }}
          />
          <motion.div
            animate={waveAnimation}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(8px)',
              zIndex: 0
            }}
          />
          <motion.div
            animate={spiralAnimation}
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01))',
              backdropFilter: 'blur(12px)',
              zIndex: 0
            }}
          />
          <motion.div
            animate={glowAnimation}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
              zIndex: 0
            }}
          />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <AutoAwesome sx={{ fontSize: 60, color: '#FFD700', mr: 2 }} />
            <Typography 
              variant="h1" 
              sx={{ 
                        fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem', lg: '6.5rem' },
                        fontWeight: 900,
                        background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 25%, #FF6347 50%, #FF1493 75%, #9370DB 100%)',
                        backgroundSize: '300% 300%',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'gradientShift 3s ease-in-out infinite',
                        textShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        filter: 'brightness(1.2) contrast(1.1)',
                        '@keyframes gradientShift': {
                          '0%': { backgroundPosition: '0% 50%' },
                          '50%': { backgroundPosition: '100% 50%' },
                          '100%': { backgroundPosition: '0% 50%' }
                        }
              }}
            >
              AI Study Buddy
            </Typography>
                    <AutoAwesome sx={{ fontSize: 60, color: '#FFD700', ml: 2 }} />
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
            <Typography 
                    variant="h3" 
              sx={{ 
                mb: 4, 
                      opacity: 0.95,
                      maxWidth: '800px',
                mx: 'auto',
                      fontSize: { xs: '1.4rem', md: '1.8rem' },
                      fontWeight: 300,
                      lineHeight: 1.5,
                      textShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
                    Revolutionize your learning with AI-powered intelligence that adapts to your unique study style
            </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/register')}
                        startIcon={<RocketLaunch />}
                sx={{ 
                          background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)',
                          color: '#1a1a1a',
                          px: 6,
                          py: 2.5,
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          borderRadius: '50px',
                          boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)',
                          textTransform: 'none',
                  '&:hover': {
                            background: 'linear-gradient(45deg, #FFA500 0%, #FFD700 100%)',
                            boxShadow: '0 16px 50px rgba(255, 215, 0, 0.6)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Get Started
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
                        startIcon={<Lightbulb />}
                sx={{ 
                  borderColor: '#ffffff',
                          borderWidth: 3,
                  color: '#ffffff',
                          px: 6,
                          py: 2.5,
                          fontSize: '1.2rem',
                  fontWeight: 600,
                          borderRadius: '50px',
                          textTransform: 'none',
                          backdropFilter: 'blur(10px)',
                  '&:hover': {
                            borderColor: '#FFD700',
                            bgcolor: 'rgba(255, 215, 0, 0.1)',
                            borderWidth: 3,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Button>
                    </motion.div>
                  </Box>
                </motion.div>

                {/* Enhanced scroll indicator */}
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ marginTop: '4rem' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>
                      Discover More
                    </Typography>
                    <ArrowDownward sx={{ fontSize: 40, opacity: 0.7 }} />
            </Box>
                </motion.div>
          </Box>
            </motion.div>
        </Container>
      </Box>
      </motion.div>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 10, md: 16 }, 
        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(245, 87, 108, 0.1) 20%, rgba(240, 147, 251, 0.1) 40%, rgba(102, 126, 234, 0.1) 60%, rgba(118, 75, 162, 0.1) 80%, #f5f7fa 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 800,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Powerful Features for Modern Learning
            </Typography>
            <Typography 
                  variant="h5" 
              color="text.secondary"
                  sx={{ 
                    maxWidth: '800px', 
                    mx: 'auto', 
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  Experience the future of education with our cutting-edge AI technology designed to accelerate your learning journey
            </Typography>
          </Box>
            </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                <Card 
                  sx={{ 
                        height: '450px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    transition: 'all 0.3s ease',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 5, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                    <Box 
                      sx={{ 
                                background: feature.gradient,
                        borderRadius: '50%',
                                width: 120,
                                height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                                mb: 4,
                                boxShadow: `0 12px 40px ${alpha(feature.color, 0.4)}`,
                                position: 'relative',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: -2,
                                  left: -2,
                                  right: -2,
                                  bottom: -2,
                                  borderRadius: '50%',
                                  background: feature.gradient,
                                  zIndex: -1,
                                  opacity: 0.3,
                                  filter: 'blur(10px)'
                                }
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                                sx: { fontSize: 60, color: '#ffffff' }
                      })}
                    </Box>
                          </motion.div>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700, 
                              mb: 3,
                              background: feature.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}
                          >
                      {feature.title}
                    </Typography>
                        </Box>
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          sx={{ 
                            lineHeight: 1.7,
                            fontSize: '1.1rem',
                            fontWeight: 400,
                            textAlign: 'center'
                          }}
                        >
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
      <Box sx={{ 
        py: { xs: 10, md: 16 }, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8f4fd 25%, #f0f8ff 50%, #ffffff 100%)',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 800,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Your Learning Journey in Three Steps
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: '800px', 
                    mx: 'auto', 
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  From upload to mastery - our intelligent system guides you through every step of your learning process
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={8} alignItems="center">
              {[
                {
                  step: '01',
                  title: 'Upload & Connect',
                  description: 'Seamlessly upload your study materials - from PDFs to lecture notes. Our AI instantly analyzes and organizes your content.',
                  icon: <Upload sx={{ fontSize: 70 }} />,
                  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                },
                {
                  step: '02',
                  title: 'AI Intelligence',
                  description: 'Watch as our advanced AI processes your materials, creating personalized study resources, flashcards, and adaptive quizzes.',
                  icon: <Psychology sx={{ fontSize: 70 }} />,
                  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                },
                {
                  step: '03',
                  title: 'Master & Excel',
                  description: 'Engage with your personalized learning tools, track progress with analytics, and achieve mastery through intelligent insights.',
                  icon: <TrendingUp sx={{ fontSize: 70 }} />,
                  gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                      <Box 
                        sx={{ 
                          background: step.gradient,
                          borderRadius: '50%',
                          width: 160,
                          height: 160,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 4,
                          position: 'relative',
                          boxShadow: `0 16px 50px ${alpha('#667eea', 0.3)}`,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -3,
                            left: -3,
                            right: -3,
                            bottom: -3,
                            borderRadius: '50%',
                            background: step.gradient,
                            zIndex: -1,
                            opacity: 0.2,
                            filter: 'blur(15px)'
                          }
                        }}
                      >
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            position: 'absolute',
                            top: -15,
                            right: -15,
                            background: step.gradient,
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                          }}
                        >
                          {step.step}
                        </Typography>
                        <Box sx={{ color: '#ffffff' }}>
                          {step.icon}
                        </Box>
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                fontWeight: 700,
                mb: 3,
                          background: step.gradient,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
              }}
            >
                        {step.title}
            </Typography>
            <Typography 
                        variant="body1" 
              color="text.secondary"
                        sx={{ 
                          lineHeight: 1.7,
                          fontSize: '1.1rem',
                          fontWeight: 400
                        }}
                      >
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
      <Box sx={{ 
        py: { xs: 10, md: 16 }, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background elements */}
        <motion.div
          animate={floatingAnimation}
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 0
          }}
        />
        <motion.div
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', mb: 10 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 800,
                    mb: 4,
                    color: '#ffffff',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  Experience AI-Powered Learning
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    maxWidth: '800px', 
                    mx: 'auto', 
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  Try our intelligent study assistant and discover how AI can transform your learning experience
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
          py: { xs: 10, md: 16 },
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 25%, rgba(240, 147, 251, 0.6) 50%, rgba(245, 87, 108, 0.6) 75%, rgba(79, 172, 254, 0.6) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 20s ease infinite',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={spiralAnimation}
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            zIndex: 0
          }}
        />
        <motion.div
          animate={{
            ...pulseAnimation,
            transition: { ...pulseAnimation.transition, delay: 3 }
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
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
                    fontSize: { xs: '3rem', md: '4rem' },
                    fontWeight: 800,
                    mb: 4,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
            >
              Ready to Transform Your Learning?
            </Typography>
            <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 8, 
                    opacity: 0.95, 
                    lineHeight: 1.6,
                    fontSize: '1.4rem',
                    fontWeight: 400
                  }}
                >
                  Join thousands of students who are already accelerating their learning journey with AI Study Buddy
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
                    startIcon={<RocketLaunch />}
              sx={{ 
                      background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)',
                      color: '#1a1a1a',
                      px: 8,
                      py: 3,
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      borderRadius: '50px',
                      boxShadow: '0 16px 50px rgba(255, 215, 0, 0.5)',
                      textTransform: 'none',
                '&:hover': {
                        background: 'linear-gradient(45deg, #FFA500 0%, #FFD700 100%)',
                        boxShadow: '0 20px 60px rgba(255, 215, 0, 0.7)',
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    Start Your Journey Today
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
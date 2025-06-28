import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Avatar,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
  alpha,
  Chip,
  Grid
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  School,
  CalendarToday,
  Settings,
  Notifications,
  Security,
  Help,
  Logout,
  CheckCircle,
  TrendingUp,
  Psychology,
  Quiz
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserProfilePage = () => {
  const theme = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const stats = [
    { label: 'Subjects Studied', value: '8', icon: <School />, color: theme.palette.primary.main },
    { label: 'Quizzes Taken', value: '24', icon: <Quiz />, color: theme.palette.secondary.main },
    { label: 'Study Hours', value: '156', icon: <TrendingUp />, color: '#10B981' },
    { label: 'Flashcards', value: '342', icon: <Psychology />, color: '#F59E0B' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2, boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              Back to Study
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              User Profile
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '3rem',
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </Avatar>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    borderRadius: '50%',
                    minWidth: 'auto',
                    width: 40,
                    height: 40
                  }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit sx={{ fontSize: 16 }} />
                </Button>
              </Box>
              
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {currentUser?.email}
              </Typography>
              <Chip
                label="Active Member"
                color="success"
                icon={<CheckCircle />}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(stat.color, 0.2)}`
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          <Grid container spacing={4}>
            {/* Profile Information */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    Profile Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        value={currentUser?.displayName || currentUser?.email?.split('@')[0] || ''}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        value={currentUser?.email || ''}
                        disabled
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Member Since
                      </Typography>
                      <TextField
                        fullWidth
                        value={currentUser?.metadata?.creationTime ? 
                          new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                          'Recently'
                        }
                        disabled
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    </Box>
                  </Box>
                  
                  {isEditing && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        sx={{ borderRadius: 2 }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => setIsEditing(false)}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            {/* Settings */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Settings />
                    Settings
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Notifications />
                      </ListItemIcon>
                      <ListItemText
                        primary="Push Notifications"
                        secondary="Receive study reminders and updates"
                      />
                      <Switch
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                      />
                    </ListItem>
                    
                    <Divider />
                    
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Updates"
                        secondary="Get weekly progress reports"
                      />
                      <Switch
                        checked={emailUpdates}
                        onChange={(e) => setEmailUpdates(e.target.checked)}
                      />
                    </ListItem>
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <Security />
                      </ListItemIcon>
                      <ListItemText
                        primary="Privacy & Security"
                        secondary="Manage your account security"
                      />
                    </ListItem>
                    
                    <ListItem button>
                      <ListItemIcon>
                        <Help />
                      </ListItemIcon>
                      <ListItemText
                        primary="Help & Support"
                        secondary="Get help and contact support"
                      />
                    </ListItem>
                    
                    <ListItem button onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout />
                      </ListItemIcon>
                      <ListItemText
                        primary="Logout"
                        secondary="Sign out of your account"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserProfilePage; 
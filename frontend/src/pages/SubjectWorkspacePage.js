import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Chat,
  Quiz,
  Psychology,
  School,
  Send,
  PlayArrow,
  Add,
  Close,
  CheckCircle,
  TrendingUp,
  Timer,
  Warning
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSubjectConfig, isSubjectAISupported } from '../data/subjectConfigs';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const SubjectWorkspacePage = () => {
  const theme = useTheme();
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [error, setError] = useState(null);

  const currentSubject = getSubjectConfig(subjectId);

  useEffect(() => {
    if (!currentSubject) {
      navigate('/dashboard');
      return;
    }

    if (!currentUser) {
      setError('Please sign in to use chat features');
      return;
    }

    // Initialize chat for the current subject
    initializeChat();
  }, [subjectId, currentSubject, currentUser, navigate]);

  const initializeChat = async () => {
    if (!currentUser || !subjectId) return;

    try {
      // Create a new chat for this subject
      const response = await axios.post('/api/chats', {
        user_id: currentUser.uid,
        subject: subjectId,
        llm: 'openai', // Default to OpenAI for now
        title: `${currentSubject.name} Chat`
      });

      if (response.data.success) {
        setCurrentChatId(response.data.chat.id);
        // Load existing messages if any
        loadChatHistory(response.data.chat.id);
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError('Failed to initialize chat. Please try again.');
    }
  };

  const loadChatHistory = async (chatId) => {
    try {
      const response = await axios.get(`/api/chats/${chatId}/messages`);
      if (response.data.success) {
        setChatHistory(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const functions = [
    {
      id: 'ask-questions',
      title: 'Ask Questions',
      description: 'Get subject-specific answers from our AI tutor',
      icon: <Chat sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      features: [
        'Context-aware responses',
        'Step-by-step explanations',
        'Real-time assistance'
      ],
      available: isSubjectAISupported(subjectId)
    },
    {
      id: 'take-quiz',
      title: 'Take a Quiz',
      description: 'Test your knowledge with AI-generated questions',
      icon: <Quiz sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      features: [
        'Adaptive difficulty',
        'Instant feedback',
        'Progress tracking'
      ],
      available: isSubjectAISupported(subjectId)
    },
    {
      id: 'generate-flashcards',
      title: 'Generate Flashcards',
      description: 'Create study materials from your notes',
      icon: <Psychology sx={{ fontSize: 40 }} />,
      color: '#10B981',
      features: [
        'Smart content extraction',
        'Customizable cards',
        'Spaced repetition'
      ],
      available: isSubjectAISupported(subjectId)
    }
  ];

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

  const handleFunctionClick = (func) => {
    if (!func.available) {
      setError('AI features are not yet available for this subject. Coming soon!');
      return;
    }
    setSelectedFunction(func);
    setError(null);
  };

  const handleCloseDialog = () => {
    setSelectedFunction(null);
    setQuestion('');
    setChatHistory([]);
    setError(null);
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !currentChatId) return;
    
    setIsLoading(true);
    const userQuestion = question;
    setQuestion('');
    
    setChatHistory(prev => [{ type: 'user', content: userQuestion }, ...prev]);
    
    // Scroll to top after adding user message
    setTimeout(() => {
      const chatHistory = document.getElementById('chat-history');
      if (chatHistory) {
        chatHistory.scrollTop = 0;
      }
    }, 100);
    
    try {
      const response = await axios.post(`/api/chats/${currentChatId}/messages`, {
        sender: 'user',
        content: userQuestion
      });

      if (response.data.success) {
        // Add the AI response to chat history
        setChatHistory(prev => [{ type: 'ai', content: response.data.aiResponse }, ...prev]);
      }
      
      // Scroll to top after adding AI response
      setTimeout(() => {
        const chatHistory = document.getElementById('chat-history');
        if (chatHistory) {
          chatHistory.scrollTop = 0;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setChatHistory(prev => [{ 
        type: 'ai', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }, ...prev]);
      
      // Scroll to top after adding error message
      setTimeout(() => {
        const chatHistory = document.getElementById('chat-history');
        if (chatHistory) {
          chatHistory.scrollTop = 0;
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!currentChatId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/chats/${currentChatId}/messages`, {
        sender: 'user',
        content: 'Generate a quiz on general topics with medium difficulty and 10 questions.'
      });
      console.log('Generated quiz:', response.data);
      // TODO: Navigate to quiz page or show quiz
      alert('Quiz generated! (Check console for details)');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!currentChatId) return;
    
    try {
      setIsLoading(true);
      const sampleContent = `Sample ${currentSubject.name} content for flashcard generation.`;
      const response = await axios.post(`/api/chats/${currentChatId}/messages`, {
        sender: 'user',
        content: `Generate 10 flashcards from this content: "${sampleContent}". Each flashcard should be a question-answer pair.`
      });
      console.log('Generated flashcards:', response.data);
      // TODO: Navigate to flashcard page or show flashcards
      alert('Flashcards generated! (Check console for details)');
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      setError('Failed to generate flashcards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFunctionDialog = () => {
    if (!selectedFunction) return null;

    return (
      <Dialog 
        open={!!selectedFunction} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}>
          <Box sx={{ color: selectedFunction.color }}>
            {selectedFunction.icon}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            {selectedFunction.title}
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            sx={{ ml: 'auto' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {selectedFunction.id === 'ask-questions' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Ask any question about {currentSubject.name}. Our AI tutor is trained specifically on {currentSubject.context.toLowerCase()}.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Sample Questions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentSubject.sampleQuestions.map((q, idx) => (
                    <Chip
                      key={idx}
                      label={q}
                      size="small"
                      variant="outlined"
                      onClick={() => setQuestion(q)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ask your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isLoading}
                  sx={{ 
                    borderRadius: 2,
                    minWidth: 'auto',
                    width: 56,
                    height: 56
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : <Send />}
                </Button>
              </Box>
              
              {chatHistory.length > 0 && (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }} id="chat-history">
                  {chatHistory.map((msg, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: msg.type === 'user' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[100], 0.5),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                        {msg.type === 'user' ? 'You' : 'AI Tutor'}
                      </Typography>
                      <Box sx={{ 
                        '& p': { mb: 1 },
                        '& ul, & ol': { pl: 2, mb: 1 },
                        '& li': { mb: 0.5 },
                        '& strong': { fontWeight: 600 },
                        '& h1, & h2, & h3, & h4, & h5, & h6': { 
                          fontWeight: 600, 
                          mb: 1, 
                          mt: 2 
                        }
                      }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          
          {selectedFunction.id === 'take-quiz' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Ready to test your {currentSubject.name} knowledge? Our AI will generate questions based on your study progress.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer />
                    Quiz Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 10 questions per quiz<br/>
                    • Adaptive difficulty based on your performance<br/>
                    • Instant feedback and explanations
                  </Typography>
                </Paper>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
                  onClick={handleStartQuiz}
                  disabled={isLoading}
                  sx={{ 
                    borderRadius: 2,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
                </Button>
              </Box>
            </Box>
          )}
          
          {selectedFunction.id === 'generate-flashcards' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Create personalized flashcards from your notes or let AI generate them based on {currentSubject.name} topics.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#10B981', 0.1) }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Add />
                    Create New Set
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Upload your notes or paste text<br/>
                    • AI will extract key concepts<br/>
                    • Generate question-answer pairs
                  </Typography>
                </Paper>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Add />}
                  onClick={handleGenerateFlashcards}
                  disabled={isLoading}
                  sx={{ 
                    borderRadius: 2,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: '#10B981',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  {isLoading ? 'Generating Flashcards...' : 'Generate Flashcards'}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (!currentSubject) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: 1, 
        borderColor: 'divider', 
        py: 2, 
        boxShadow: 1,
        background: `linear-gradient(135deg, ${alpha(currentSubject.color, 0.1)} 0%, ${alpha(currentSubject.color, 0.05)} 100%)`
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{ borderRadius: 2 }}
            >
              Back to Subjects
            </Button>
            <Avatar
              sx={{
                bgcolor: currentSubject.color,
                width: 48,
                height: 48,
                fontSize: '1.5rem'
              }}
            >
              {currentSubject.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: currentSubject.color }}>
                {currentSubject.name} Workspace
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentSubject.description}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Error Alert */}
          {error && (
            <motion.div variants={itemVariants}>
              <Alert 
                severity="warning" 
                icon={<Warning />}
                onClose={() => setError(null)}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Welcome to {currentSubject.name}, {currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'Learner'}! 🎯
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Choose a learning tool to get started
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  label={`AI-Powered ${currentSubject.name} Learning`} 
                  color="primary" 
                  variant="outlined" 
                  sx={{ borderRadius: 2 }}
                />
                {isSubjectAISupported(subjectId) ? (
                  <Chip 
                    label="AI Features Available" 
                    color="success" 
                    variant="outlined" 
                    sx={{ borderRadius: 2 }}
                  />
                ) : (
                  <Chip 
                    label="AI Features Coming Soon" 
                    color="warning" 
                    variant="outlined" 
                    sx={{ borderRadius: 2 }}
                  />
                )}
              </Box>
            </Paper>
          </motion.div>

          {/* Functions Grid */}
          <Grid container spacing={4}>
            {functions.map((func, index) => (
              <Grid item xs={12} md={4} key={func.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={func.available ? { y: -8, scale: 1.02 } : {}}
                  whileTap={func.available ? { scale: 0.98 } : {}}
                >
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 3,
                      cursor: func.available ? 'pointer' : 'default',
                      transition: 'all 0.3s ease',
                      background: `linear-gradient(135deg, ${alpha(func.color, func.available ? 0.1 : 0.05)} 0%, ${alpha(func.color, func.available ? 0.05 : 0.02)} 100%)`,
                      border: `1px solid ${alpha(func.color, func.available ? 0.2 : 0.1)}`,
                      opacity: func.available ? 1 : 0.6,
                      '&:hover': func.available ? {
                        boxShadow: `0 8px 25px ${alpha(func.color, 0.3)}`,
                        transform: 'translateY(-8px)',
                        border: `2px solid ${alpha(func.color, 0.4)}`
                      } : {}
                    }}
                    onClick={() => handleFunctionClick(func)}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: alpha(func.color, func.available ? 0.1 : 0.05),
                          mb: 3,
                          border: `2px solid ${alpha(func.color, func.available ? 0.3 : 0.1)}`
                        }}
                      >
                        <Box sx={{ color: func.color }}>
                          {func.icon}
                        </Box>
                      </Box>
                      
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: func.color }}>
                        {func.title}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {func.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {func.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircle sx={{ fontSize: 16, color: func.color }} />
                            <Typography variant="body2" color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      {!func.available && (
                        <Chip
                          label="Coming Soon"
                          color="warning"
                          size="small"
                          sx={{ mt: 2, borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Progress Section */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, mt: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                Your {currentSubject.name} Progress
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: currentSubject.color }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Questions Asked
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: currentSubject.color }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quizzes Taken
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: currentSubject.color }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Flashcards Created
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {renderFunctionDialog()}
    </Box>
  );
};

export default SubjectWorkspacePage; 
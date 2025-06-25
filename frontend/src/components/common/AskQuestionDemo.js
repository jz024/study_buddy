import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';
import axios from 'axios';

const AskQuestionDemo = () => {
  const theme = useTheme();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      console.log('Sending request to:', 'http://localhost:5001/api/chat');
      console.log('Request data:', { message: question, subjectId: null });
      
      const result = await axios.post('http://localhost:5001/api/chat', {
        message: question.trim(),
        subjectId: null
      });

      console.log('Response received:', result.data);

      if (result.data.success) {
        setResponse(result.data.data.aiResponse);
      } else {
        setError(result.data.message || 'Failed to get response from AI');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors && errorData.errors.length > 0) {
          setError(errorData.errors[0].msg);
        } else {
          setError(errorData.message || 'Invalid request');
        }
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to AI service. Please check if the server is running.');
      } else {
        setError('Failed to connect to AI service. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                mb: 2
              }}
            >
              <SmartToy sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
              Ask AI Study Buddy
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Try our AI-powered study assistant! Ask any question and get instant, helpful responses.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Ask me anything!"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!question.trim() || loading}
                sx={{
                  minWidth: 60,
                  height: 56,
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  },
                  '&:disabled': {
                    opacity: 0.6
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Send />
                )}
              </Button>
            </Box>
          </form>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                bgcolor: alpha(theme.palette.success.main, 0.05),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SmartToy sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="h6" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                  AI Response
                </Typography>
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {response}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AskQuestionDemo; 
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import { Send, SmartToy, Mic, MicOff, Stop } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = ''; // Use relative URLs since proxy is configured

const AskQuestionDemo = () => {
  const theme = useTheme();
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request audio with better quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        } 
      });
      
      // Try different audio formats in order of preference
      const formats = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];
      
      let selectedFormat = null;
      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          selectedFormat = format;
          break;
        }
      }
      
      if (selectedFormat) {
        mediaRecorderRef.current = new MediaRecorder(stream, { 
          mimeType: selectedFormat,
          audioBitsPerSecond: 128000 // Higher quality
        });
      } else {
        mediaRecorderRef.current = new MediaRecorder(stream);
      }
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        
        // Check if audio is too short
        if (audioBlob.size < 1000) {
          setError('Recording too short. Please speak for at least 1-2 seconds.');
          return;
        }
        
        await transcribeAudio(audioBlob);
      };

      // Start recording with smaller timeslice for more frequent data
      mediaRecorderRef.current.start(100); // Get data every 100ms
      setIsRecording(true);
      setError('');
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      
      // Start timer to track recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Clear the recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Check minimum recording duration
      if (recordingDuration < 1) {
        setError('Please record for at least 1 second.');
        setIsRecording(false);
        setRecordingDuration(0);
        setRecordingStartTime(null);
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        return;
      }
      
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingDuration(0);
      setRecordingStartTime(null);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1]; // Remove data URL prefix

        const requestUrl = `${API_BASE_URL}/api/speech/transcribe-base64`;
        const requestData = {
          audioData: base64Audio,
          languageCode: 'en-US',
          encoding: audioBlob.type // Send the audio format
        };

        try {
          const response = await axios.post(requestUrl, requestData);

          if (response.data.success) {
            setQuestion(response.data.data.transcript);
          } else {
            setError('Failed to transcribe audio: ' + response.data.message);
          }
        } catch (apiError) {
          setError('Failed to transcribe audio: ' + (apiError.response?.data?.message || apiError.message));
        }
        setIsTranscribing(false);
      };
      
      reader.onerror = (error) => {
        setError('Failed to read audio file');
        setIsTranscribing(false);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      setError('Failed to transcribe audio. Please try again.');
      setIsTranscribing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    const userQuestion = question.trim();
    setQuestion('');
    setChatHistory(prev => [{ type: 'user', content: userQuestion }, ...prev]);
    
    // Scroll to top after adding user message
    setTimeout(() => {
      const chatHistory = document.getElementById('demo-chat-history');
      if (chatHistory) {
        chatHistory.scrollTop = 0;
      }
    }, 100);
    
    setLoading(true);
    setError('');

    try {
      const requestUrl = `${API_BASE_URL}/api/chat`;
      const requestData = { message: userQuestion, subjectId: null };
      
      const result = await axios.post(requestUrl, requestData);

      if (result.data.success) {
        setChatHistory(prev => [{ type: 'ai', content: result.data.data.aiResponse }, ...prev]);
        
        // Scroll to top after adding AI response
        setTimeout(() => {
          const chatHistory = document.getElementById('demo-chat-history');
          if (chatHistory) {
            chatHistory.scrollTop = 0;
          }
        }, 100);
      } else {
        setError(result.data.message || 'Failed to get response from AI');
        setChatHistory(prev => [{ 
          type: 'ai', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }, ...prev]);
        
        // Scroll to top after adding error message
        setTimeout(() => {
          const chatHistory = document.getElementById('demo-chat-history');
          if (chatHistory) {
            chatHistory.scrollTop = 0;
          }
        }, 100);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors && errorData.errors.length > 0) {
          setError(errorData.errors[0].msg);
        } else {
          setError(errorData.message || 'Invalid request');
        }
        setChatHistory(prev => [{ 
          type: 'ai', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }, ...prev]);
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to AI service. Please check if the server is running.');
        setChatHistory(prev => [{ 
          type: 'ai', 
          content: 'Cannot connect to AI service. Please check if the server is running.' 
        }, ...prev]);
      } else {
        setError('Failed to connect to AI service. Please try again.');
        setChatHistory(prev => [{ 
          type: 'ai', 
          content: 'Failed to connect to AI service. Please try again.' 
        }, ...prev]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 3s ease infinite',
            '@keyframes gradientShift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                width: 100,
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  zIndex: -1,
                  opacity: 0.3,
                  filter: 'blur(10px)'
                }
              }}
            >
              <SmartToy sx={{ fontSize: 50, color: '#ffffff' }} />
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 2, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Ask AI Study Buddy
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                fontSize: '1.1rem',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Experience the power of AI-powered learning! Ask any question and get instant, intelligent responses.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Ask me anything! Or click the microphone to speak..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading || isTranscribing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1.1rem',
                      fontWeight: 400
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!isRecording ? (
                  <Tooltip title="Click to start recording">
                    <IconButton
                      onClick={startRecording}
                      disabled={loading || isTranscribing}
                      sx={{
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                          boxShadow: '0 12px 35px rgba(240, 147, 251, 0.6)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          opacity: 0.5,
                          transform: 'none'
                        }
                      }}
                    >
                      {isTranscribing ? <CircularProgress size={24} color="inherit" /> : <Mic />}
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to stop recording">
                    <IconButton
                      onClick={stopRecording}
                      sx={{
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                          boxShadow: '0 12px 35px rgba(255, 107, 107, 0.6)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Stop />
                    </IconButton>
                  </Tooltip>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!question.trim() || loading || isTranscribing}
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 8px 25px rgba(79, 172, 254, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                      boxShadow: '0 12px 35px rgba(79, 172, 254, 0.6)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      transform: 'none'
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
            </Box>
          </form>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: '16px',
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {isRecording && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4, 
                borderRadius: '16px',
                background: 'rgba(79, 172, 254, 0.1)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#4facfe'
                }
              }}
            >
              🎤 Recording... {recordingDuration}s - Click the stop button when you're done speaking.
            </Alert>
          )}

          {isTranscribing && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4, 
                borderRadius: '16px',
                background: 'rgba(240, 147, 251, 0.1)',
                border: '1px solid rgba(240, 147, 251, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#f093fb'
                }
              }}
            >
              🔄 Transcribing your speech...
            </Alert>
          )}

          {chatHistory.length > 0 && (
            <Box sx={{ maxHeight: 500, overflowY: 'auto', mb: 2 }} id="demo-chat-history">
              {chatHistory.map((msg, idx) => (
                <Paper 
                  key={idx}
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    mb: 2,
                    background: msg.type === 'user' 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
                    border: msg.type === 'user'
                      ? '1px solid rgba(102, 126, 234, 0.3)'
                      : '1px solid rgba(67, 233, 123, 0.3)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: msg.type === 'user'
                        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        background: msg.type === 'user'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        boxShadow: msg.type === 'user'
                          ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                          : '0 4px 15px rgba(67, 233, 123, 0.4)'
                      }}
                    >
                      {msg.type === 'user' ? (
                        <Typography sx={{ fontSize: 16, color: '#ffffff', fontWeight: 600 }}>
                          U
                        </Typography>
                      ) : (
                        <SmartToy sx={{ fontSize: 20, color: '#ffffff' }} />
                      )}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        background: msg.type === 'user'
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700
                      }}
                    >
                      {msg.type === 'user' ? 'You' : 'AI Response'}
                    </Typography>
                  </Box>
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
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AskQuestionDemo; 
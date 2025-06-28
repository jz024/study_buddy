import React, { useState, useRef, useEffect } from 'react';
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
  const [response, setResponse] = useState('');
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

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const requestUrl = `${API_BASE_URL}/api/chat`;
      const requestData = { message: question.trim(), subjectId: null };
      
      const result = await axios.post(requestUrl, requestData);

      if (result.data.success) {
        setResponse(result.data.data.aiResponse);
      } else {
        setError(result.data.message || 'Failed to get response from AI');
      }
    } catch (err) {
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
                placeholder="Ask me anything! Or click the microphone to speak..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading || isTranscribing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {!isRecording ? (
                  <Tooltip title="Click to start recording">
                    <IconButton
                      onClick={startRecording}
                      disabled={loading || isTranscribing}
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                        },
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      {isTranscribing ? <CircularProgress size={20} /> : <Mic />}
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to stop recording">
                    <IconButton
                      onClick={stopRecording}
                      sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.2),
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
            </Box>
          </form>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {isRecording && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              🎤 Recording... {recordingDuration}s - Click the stop button when you're done speaking.
            </Alert>
          )}

          {isTranscribing && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              🔄 Transcribing your speech...
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
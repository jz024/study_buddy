import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = ''; // Use relative URLs since proxy is configured

const TestChat = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // This calls the backend API at port 5001
      const result = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: message,
        subjectId: 'test-subject'
      });

      setResponse(result.data);
      console.log('API Response:', result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to backend');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🧪 Test Chat API
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This demonstrates how the frontend (port 3000) communicates with the backend API (port 5001)
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message to test the chat API..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button 
          variant="contained" 
          onClick={sendMessage}
          disabled={loading || !message.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            API Response:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Your message:</strong> {response.data?.userMessage}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>AI Response:</strong> {response.data?.aiResponse}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>Timestamp:</strong> {response.data?.timestamp}
          </Typography>
        </Paper>
      )}

      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 1 }}>
        <Typography variant="body2">
          <strong>How it works:</strong><br/>
          • Frontend (React) runs on port 3000<br/>
          • Backend (API) runs on port 5001<br/>
          • When you click "Send", the frontend makes an HTTP request to the backend<br/>
          • The backend processes the request and returns the response
        </Typography>
      </Box>
    </Box>
  );
};

export default TestChat; 
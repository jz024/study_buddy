import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const ModelTesting = () => {
  const [selectedModel, setSelectedModel] = useState('openai');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [demoModel, setDemoModel] = useState('openai');
  const [demoInput, setDemoInput] = useState('');
  const [demoHistory, setDemoHistory] = useState([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');

  const handleRunTest = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    setExpandedQuestions(new Set());
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat/followup-test`, {
        model: selectedModel
      });
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.message || 'Failed to run test');
      }
    } catch (error) {
      setError('Failed to run test: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSend = async () => {
    if (!demoInput.trim()) return;
    setDemoLoading(true);
    setDemoError('');
    const newHistory = [
      ...demoHistory,
      { role: 'user', content: demoInput }
    ];
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: demoInput,
        model: demoModel,
        history: newHistory.map(m => ({ role: m.role, content: m.content }))
      });
      setDemoHistory([
        ...newHistory,
        { role: 'assistant', content: response.data.data.aiResponse }
      ]);
      setDemoInput('');
    } catch (err) {
      setDemoError('Failed to get response: ' + (err.response?.data?.message || err.message));
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDemoClear = () => {
    setDemoHistory([]);
    setDemoInput('');
    setDemoError('');
  };

  const toggleQuestionExpansion = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const renderFollowUpResults = () => {
    if (!results || results.testType !== 'FollowUp') return null;
    const { results: testResults } = results;
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Follow-Up Test Results: {results.model.toUpperCase()}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Detailed Results
        </Typography>
        {testResults.map((result, index) => (
          <Accordion
            key={index}
            expanded={expandedQuestions.has(result.scenarioId)}
            onChange={() => toggleQuestionExpansion(result.scenarioId)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                  Scenario: {result.subject}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <b>Initial Question:</b> {result.initialQuestion}
              </Typography>
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {result.initialResponse}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Word Count: {result.initialWordCount} | Response Time: {result.initialResponseTime}ms
                </Typography>
              </Paper>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <b>Follow-Up Question:</b> {result.followUpQuestion}
              </Typography>
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {result.followUpResponse}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Word Count: {result.followUpWordCount} | Response Time: {result.followUpResponseTime}ms
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Model Testing Dashboard
      </Typography>

      {/* Demo Chat Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Demo Chat (Real-Time)
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={demoModel}
                  label="Model"
                  onChange={e => setDemoModel(e.target.value)}
                >
                  <MenuItem value="openai">OpenAI GPT-3.5</MenuItem>
                  <MenuItem value="llama">Llama 3.3 70B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                label="Type your message"
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !demoLoading) handleDemoSend(); }}
                disabled={demoLoading}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={handleDemoSend}
                disabled={demoLoading || !demoInput.trim()}
                fullWidth
              >
                Send
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleDemoClear} size="small" color="secondary" disabled={demoLoading}>
              Clear Chat
            </Button>
          </Box>
          {demoError && (
            <Alert severity="error" sx={{ mt: 2 }}>{demoError}</Alert>
          )}
          <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 1, border: '1px solid #eee' }}>
            {demoHistory.length === 0 && (
              <Typography variant="body2" color="text.secondary">No messages yet. Start a conversation!</Typography>
            )}
            {demoHistory.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color={msg.role === 'user' ? 'primary' : 'secondary'}>
                  {msg.role === 'user' ? 'You' : demoModel.toUpperCase()}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.95em', bgcolor: msg.role === 'user' ? 'white' : 'grey.100', p: 1, borderRadius: 1 }}>
                  {msg.content}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Follow-Up Test Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Automated Follow-Up Test
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This test uses context-dependent follow-up questions to evaluate the model's ability to remember and reference previous conversation turns.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <MenuItem value="openai">OpenAI GPT-3.5</MenuItem>
                  <MenuItem value="llama">Llama 3.3 70B</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                onClick={handleRunTest}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Run Follow-Up Test'}
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Running test... This may take several minutes for all scenarios.
            </Alert>
          )}
        </CardContent>
      </Card>
      {renderFollowUpResults()}
    </Box>
  );
};

export default ModelTesting; 
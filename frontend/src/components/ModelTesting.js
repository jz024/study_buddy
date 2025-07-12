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
  TableRow
} from '@mui/material';
import { Science, Refresh, EmojiEvents } from '@mui/icons-material';
import axios from 'axios';

const ModelTesting = () => {
  const [testType, setTestType] = useState('comprehensive');
  const [selectedModel, setSelectedModel] = useState('openai');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleRunTest = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let response;
      if (testType === 'comprehensive') {
        response = await axios.post('/api/chat/comprehensive-test');
      } else {
        response = await axios.post('/api/chat/aa-test', {
          model: selectedModel
        });
      }

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

  const renderComprehensiveResults = () => {
    if (!results || results.testType !== 'Comprehensive') return null;

    const { summary, results: testResults } = results;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🏆 Comprehensive Test Results: All 3 Models
        </Typography>

        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            🎯 Overall Winner: {summary.overallWinner.toUpperCase()}
          </Typography>
          <Typography variant="body2">
            Total Questions: {summary.totalQuestions}
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>
          📊 Model Performance Comparison
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Model</TableCell>
                <TableCell align="right">Avg Relevance</TableCell>
                <TableCell align="right">Avg Response Time</TableCell>
                <TableCell align="right">Avg Tokens</TableCell>
                <TableCell align="right">Total Wins</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(summary.modelStats).map(([model, stats]) => (
                <TableRow key={model}>
                  <TableCell component="th" scope="row">
                    {model.toUpperCase()}
                  </TableCell>
                  <TableCell align="right">
                    {(stats.avgRelevance * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {stats.avgResponseTime}ms
                  </TableCell>
                  <TableCell align="right">
                    {stats.avgTokens}
                  </TableCell>
                  <TableCell align="right">
                    {stats.totalWins}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom>
          🏅 Rankings
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                🎯 Best Relevance
              </Typography>
              {summary.rankings.relevance.map((model, index) => (
                <Typography key={model} variant="body2">
                  {index + 1}. {model.toUpperCase()}
                </Typography>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                ⚡ Fastest
              </Typography>
              {summary.rankings.speed.map((model, index) => (
                <Typography key={model} variant="body2">
                  {index + 1}. {model.toUpperCase()}
                </Typography>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                💰 Most Efficient
              </Typography>
              {summary.rankings.efficiency.map((model, index) => (
                <Typography key={model} variant="body2">
                  {index + 1}. {model.toUpperCase()}
                </Typography>
              ))}
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          📝 Detailed Results
        </Typography>
        {testResults.map((result, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Question {result.questionId}: {result.question.substring(0, 60)}...
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subject: {result.subject} | Difficulty: {result.difficulty}
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(result.models).map(([model, modelResult]) => (
                <Grid item xs={12} md={4} key={model}>
                  <Typography variant="body2" fontWeight="bold">
                    {model.toUpperCase()}:
                  </Typography>
                  <Typography variant="body2">
                    Relevance: {(modelResult.evaluation.relevance * 100).toFixed(1)}% | 
                    Length: {modelResult.evaluation.length} words | 
                    Time: {modelResult.responseTime}ms
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Box>
    );
  };

  const renderAATestResults = () => {
    if (!results || results.testType !== 'A/A') return null;

    const { summary, results: testResults } = results;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔄 A/A Test Results: {results.model.toUpperCase()} Consistency
        </Typography>

        <Paper sx={{ p: 2, mb: 2, bgcolor: summary.isConsistent ? 'success.light' : 'warning.light', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            📊 Consistency Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Total Questions: {summary.totalQuestions}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Consistent: {summary.consistentResponses}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Inconsistent: {summary.inconsistentResponses}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">Consistency Rate: {summary.consistencyRate.toFixed(1)}%</Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Overall: {summary.isConsistent ? '✅ Consistent' : '❌ Inconsistent'}
          </Typography>
        </Paper>

        <Typography variant="h6" gutterBottom>
          📈 Consistency Metrics
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Average Consistency
              </Typography>
              <Typography variant="h4">
                {(summary.avgConsistency * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Avg Length Difference
              </Typography>
              <Typography variant="h4">
                {summary.avgLengthDifference} words
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          📝 Detailed Results
        </Typography>
        {testResults.map((result, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Question {result.questionId}: {result.question.substring(0, 60)}...
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subject: {result.subject} | Difficulty: {result.difficulty}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="bold">
                  Run 1:
                </Typography>
                <Typography variant="body2">
                  Relevance: {(result.run1.evaluation.relevance * 100).toFixed(1)}% | 
                  Length: {result.run1.evaluation.length} words
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="bold">
                  Run 2:
                </Typography>
                <Typography variant="body2">
                  Relevance: {(result.run2.evaluation.relevance * 100).toFixed(1)}% | 
                  Length: {result.run2.evaluation.length} words
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={`Consistency: ${(result.consistency.consistency * 100).toFixed(1)}%`}
                color={result.consistency.isConsistent ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Model Testing Dashboard
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configure Test
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Test Type</InputLabel>
                <Select
                  value={testType}
                  label="Test Type"
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <MenuItem value="comprehensive">Comprehensive (All 3 Models)</MenuItem>
                  <MenuItem value="aa">A/A Test (Consistency)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {testType === 'aa' ? (
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Model</InputLabel>
                  <Select
                    value={selectedModel}
                    label="Model"
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <MenuItem value="openai">OpenAI GPT-3.5</MenuItem>
                    <MenuItem value="llama">Llama 3.3 70B</MenuItem>
                    <MenuItem value="mistral">Mistral Large</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  Will test all 3 models: OpenAI, Llama, and Mistral
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={testType === 'comprehensive' ? <EmojiEvents /> : <Refresh />}
                onClick={handleRunTest}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : `Run ${testType === 'comprehensive' ? 'Comprehensive' : 'A/A'} Test`}
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
              Running test... This may take several minutes for all 10 questions.
            </Alert>
          )}
        </CardContent>
      </Card>

      {renderComprehensiveResults()}
      {renderAATestResults()}
    </Box>
  );
};

export default ModelTesting; 
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import {
  Quiz,
  CheckCircle,
  Cancel,
  ExpandMore,
  PlayArrow,
  Refresh,
  Close
} from '@mui/icons-material';

const QuizDisplay = ({ quiz, onClose, onRetake }) => {
  const theme = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question && question.correctAnswer && answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    setIsSubmitting(false);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    if (onRetake) onRetake();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! You really know your stuff!';
    if (score >= 80) return 'Great job! You have a solid understanding.';
    if (score >= 60) return 'Good effort! Keep studying to improve.';
    return 'Keep practicing! Review the material and try again.';
  };

  if (!quiz) {
    return (
      <Alert severity="error">
        No quiz data available. Please try generating a new quiz.
      </Alert>
    );
  }

  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    return (
      <Alert severity="error">
        Quiz data is missing questions array. Please try generating a new quiz.
      </Alert>
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <Alert severity="error">
        Quiz has no questions. Please try generating a new quiz.
      </Alert>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  if (!currentQuestionData) {
    return (
      <Alert severity="error">
        Current question data is missing. Please try generating a new quiz.
      </Alert>
    );
  }

  const isTrueFalse = currentQuestionData.type === 'true-false';
  const isMultipleChoice = currentQuestionData.options && Array.isArray(currentQuestionData.options);

  if (!isTrueFalse && !isMultipleChoice) {
    console.error('Invalid question structure:', currentQuestionData);
    return (
      <Alert severity="error">
        Question {currentQuestion + 1} has invalid structure. Please try generating a new quiz with only multiple choice and true/false questions.
      </Alert>
    );
  }

  const questionOptions = isTrueFalse ? ['True', 'False'] : currentQuestionData.options;

  return (
    <Paper sx={{ p: 4, borderRadius: 3, height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)'
          }
        }}
      >
        <Close />
      </IconButton>

      {/* Quiz Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Quiz sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {quiz.title || 'Personalized Quiz'}
          </Typography>
        </Box>
        {quiz.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {quiz.description}
          </Typography>
        )}
        <Chip
          label={`${quiz.questions.length} Questions`}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Box>

        {!showResults ? (
          /* Quiz Questions */
          <Box>
            {/* Progress indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {quiz.questions.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: index === currentQuestion 
                        ? theme.palette.primary.main 
                        : answers[index] 
                          ? theme.palette.success.main 
                          : alpha(theme.palette.grey[500], 0.3)
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Current Question */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {currentQuestionData.question || 'Question text not available'}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                >
                  {questionOptions.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      sx={{
                        mb: 1,
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                sx={{ borderRadius: 2 }}
              >
                Previous
              </Button>

              {currentQuestion === quiz.questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || Object.keys(answers).length < quiz.questions.length}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <PlayArrow />}
                  sx={{ borderRadius: 2 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[currentQuestion]}
                  sx={{ borderRadius: 2 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          /* Quiz Results */
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[getScoreColor(score)].main, 0.1),
                    border: `4px solid ${theme.palette[getScoreColor(score)].main}`
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette[getScoreColor(score)].main }}>
                    {score}%
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {getScoreMessage(score)}
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                You got {Object.values(answers).filter((answer, index) => 
                  answer === quiz.questions[index]?.correctAnswer
                ).length} out of {quiz.questions.length} questions correct.
              </Typography>
            </Box>

            {/* Question Review */}
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Question Review
            </Typography>
            
            {quiz.questions.map((question, index) => {
              // Safety check for question structure
              const isQuestionTrueFalse = question.type === 'true-false';
              const isQuestionMultipleChoice = question.options && Array.isArray(question.options);
              
              if (!isQuestionTrueFalse && !isQuestionMultipleChoice) {
                return (
                  <Accordion key={index} sx={{ mb: 2, borderRadius: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Cancel sx={{ color: 'error.main' }} />
                        <Typography variant="body1">
                          Question {index + 1} (Invalid structure)
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="error">
                        This question has an invalid structure and cannot be displayed.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              }
              
              // Get options for display
              const reviewOptions = isQuestionTrueFalse ? ['True', 'False'] : question.options;
              
              return (
                <Accordion key={index} sx={{ mb: 2, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {answers[index] === question.correctAnswer ? (
                        <CheckCircle sx={{ color: 'success.main' }} />
                      ) : (
                        <Cancel sx={{ color: 'error.main' }} />
                      )}
                      <Typography variant="body1">
                        Question {index + 1}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {question.question || 'Question text not available'}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      {reviewOptions.map((option, optionIndex) => (
                        <Box
                          key={optionIndex}
                          sx={{
                            p: 1,
                            mb: 1,
                            borderRadius: 1,
                            bgcolor: option === question.correctAnswer 
                              ? alpha(theme.palette.success.main, 0.1)
                              : option === answers[index] && option !== question.correctAnswer
                                ? alpha(theme.palette.error.main, 0.1)
                                : 'transparent',
                            border: `1px solid ${
                              option === question.correctAnswer 
                                ? theme.palette.success.main
                                : option === answers[index] && option !== question.correctAnswer
                                  ? theme.palette.error.main
                                  : 'transparent'
                            }`
                          }}
                        >
                          <Typography variant="body2">
                            {option} {option === question.correctAnswer && '✓'}
                            {option === answers[index] && option !== question.correctAnswer && '✗'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    {question.explanation && (
                      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Explanation:
                        </Typography>
                        <Typography variant="body2">
                          {question.explanation}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleRetake}
                startIcon={<Refresh />}
                sx={{ borderRadius: 2 }}
              >
                Retake Quiz
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
    </Paper>
  );
};

export default QuizDisplay; 
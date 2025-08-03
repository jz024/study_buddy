import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Fade,
  Slide,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  School,
  NavigateNext,
  NavigateBefore,
  Refresh,
  Close,
  Flip,
  CheckCircle,
  Help
} from '@mui/icons-material';

const FlashcardDisplay = ({ flashcards, onClose, onRegenerate }) => {
  const theme = useTheme();
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (flashcards) {
      setCurrentCard(0);
      setIsFlipped(false);
      setIsRegenerating(false);
    }
  }, [flashcards]);

  const handleNext = () => {
    if (currentCard < flashcards.cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      if (onRegenerate) {
        await onRegenerate();
      }
    } catch (error) {
      console.error('Error regenerating flashcards:', error);
      alert('Failed to generate new flashcards. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!flashcards) {
    return (
      <Alert severity="error">
        No flashcard data available. Please try generating new flashcards.
      </Alert>
    );
  }

  if (!flashcards.cards || !Array.isArray(flashcards.cards)) {
    return (
      <Alert severity="error">
        Flashcard data is missing cards array. Please try generating new flashcards.
      </Alert>
    );
  }

  if (flashcards.cards.length === 0) {
    return (
      <Alert severity="error">
        Flashcards have no cards. Please try generating new flashcards.
      </Alert>
    );
  }

  const currentCardData = flashcards.cards[currentCard];
  if (!currentCardData) {
    return (
      <Alert severity="error">
        Current card data is missing. Please try generating new flashcards.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 3, height: '100%', overflow: 'auto', position: 'relative' }}>
      {/* Loading Overlay for Regenerate */}
      {isRegenerating && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 3
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Generating New Flashcards...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 300 }}>
            Creating a fresh set of study cards based on your study session. This may take a few moments.
          </Typography>
        </Box>
      )}

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        disabled={isRegenerating}
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

      {/* Flashcard Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <School sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {flashcards.title || 'Study Flashcards'}
          </Typography>
        </Box>
        {flashcards.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {flashcards.description}
          </Typography>
        )}
        <Chip
          label={`${flashcards.cards.length} Cards`}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        />
      </Box>

      {/* Progress indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Card {currentCard + 1} of {flashcards.cards.length}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {flashcards.cards.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === currentCard 
                  ? theme.palette.primary.main 
                  : alpha(theme.palette.grey[500], 0.3)
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Flashcard */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            minHeight: 300,
            cursor: 'pointer',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            '&:hover': {
              '& .flashcard-card': {
                boxShadow: theme.shadows[8]
              }
            }
          }}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <Card
            className="flashcard-card"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              opacity: isFlipped ? 0 : 1,
              transition: 'opacity 0.4s ease-in-out'
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                textAlign: 'center',
                minHeight: 300
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
                {currentCardData.question || 'Question not available'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click to flip and see the answer
              </Typography>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card
            className="flashcard-card"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              opacity: isFlipped ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
              bgcolor: alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                textAlign: 'center',
                minHeight: 300
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                {currentCardData.answer || 'Answer not available'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click to flip back to question
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentCard === 0 || isRegenerating}
          startIcon={<NavigateBefore />}
          sx={{ borderRadius: 2 }}
        >
          Previous
        </Button>

        <Button
          variant="outlined"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          startIcon={isRegenerating ? <CircularProgress size={20} /> : <Refresh />}
          sx={{ borderRadius: 2 }}
        >
          {isRegenerating ? 'Generating...' : 'New Set'}
        </Button>

        <Button
          variant="outlined"
          onClick={handleNext}
          disabled={currentCard === flashcards.cards.length - 1 || isRegenerating}
          endIcon={<NavigateNext />}
          sx={{ borderRadius: 2 }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default FlashcardDisplay; 
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { Button, TextField, MenuItem, Typography, Box, Paper } from '@mui/material';

const educationLevels = [
  'Elementary',
  'Middle School',
  'High School',
  'College',
  'Graduate',
  'Other',
];

export default function OnboardingSurveyPage() {
  const { currentUser } = useContext(AuthContext);
  const [educationLevel, setEducationLevel] = useState('');
  const [age, setAge] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore(getApp());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!educationLevel || !age || !learningGoals) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        educationLevel,
        age,
        learningGoals,
      }, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Welcome! Tell us about yourself</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Education Level"
            value={educationLevel}
            onChange={e => setEducationLevel(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {educationLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1, max: 120 }}
          />
          <TextField
            label="Learning Goals"
            value={learningGoals}
            onChange={e => setLearningGoals(e.target.value)}
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 
import React, { useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionsByDifficulty, resetQuestions } from '../../redux/slices/technicalInterview/technicalInterview.slice';

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const InstructionsPage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { interviewId } = useParams();
  const { questionsStatus, questions } = useSelector((state) => state.interviewTopics);

  const handleStartInterview = () => {
    if (selectedDifficulty && interviewId) {
      // Reset the questions state before fetching new questions
      dispatch(resetQuestions());

      dispatch(fetchQuestionsByDifficulty({ interviewId, difficulty: selectedDifficulty }))
        .then((resultAction) => {
          if (resultAction.meta.requestStatus === 'fulfilled') {
            // Navigate to TechnicalInterviewPage and pass the questions in state
            navigate(`/dashboard/techinterviewpage/${interviewId}`, {
              state: { difficulty: selectedDifficulty, questions: resultAction.payload.questions },
            });
          } else {
            alert('Failed to fetch questions. Please try again.');
          }
        });
    } else {
      alert('Please select a difficulty level.');
    }
  };

  return (
    <Box
      sx={{
        padding: '40px 20px',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="bg-gradient-to-t from-lime-100 to-cyan-100"
    >
      <Box
        sx={{
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#37474f' }}>
          Interview Instructions
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#607d8b', mb: 4 }}>
          Welcome to your AI-powered interview prep! Follow these instructions carefully before starting:
        </Typography>
        
        <Box sx={{ textAlign: 'left', mb: 4 }}>
          <Typography variant="body2" sx={{ color: '#455a64', mb: 2 }}>
            1. Make sure you are in a quiet place for optimal performance.
          </Typography>
          <Typography variant="body2" sx={{ color: '#455a64', mb: 2 }}>
            2. Have your notes and materials ready to reference.
          </Typography>
          <Typography variant="body2" sx={{ color: '#455a64', mb: 2 }}>
            3. Select a difficulty level based on your readiness.
          </Typography>
          <Typography variant="body2" sx={{ color: '#455a64', mb: 2 }}>
            4. Once you're prepared, click "Start Interview" to begin.
          </Typography>
        </Box>

        <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
          <InputLabel id="difficulty-label">Select Difficulty</InputLabel>
          <Select
            labelId="difficulty-label"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            label="Select Difficulty"
            sx={{ borderRadius: '12px' }}
          >
            {difficultyLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleStartInterview}
          disabled={questionsStatus === 'loading'}
          sx={{
            padding: '12px 24px',
            borderRadius: '30px',
            backgroundColor: '#00796b',
            '&:hover': {
              backgroundColor: '#004d40',
            },
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
          }}
        >
          {questionsStatus === 'loading' ? 'Loading Questions...' : 'Start Interview'}
        </Button>
      </Box>
    </Box>
  );
};

export default InstructionsPage;

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const DifficultyModal = ({ open, onClose, onDifficultySelect }) => {
  const [difficulty, setDifficulty] = useState('');

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSubmit = () => {
    onDifficultySelect(difficulty);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="difficulty-modal-title"
      aria-describedby="difficulty-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          border: '1px solid #ddd',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <Typography
          id="difficulty-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          Choose Difficulty Level
        </Typography>
        <Typography
          id="difficulty-modal-description"
          sx={{ mb: 3, color: '#555' }}
        >
          Select the difficulty level for the quiz. The chosen difficulty will affect the question complexity.
        </Typography>
        <RadioGroup value={difficulty} onChange={handleDifficultyChange}>
          <FormControlLabel
            value="Easy"
            control={<Radio sx={{ '&.Mui-checked': { color: '#4CAF50' } }} />}
            label="Easy"
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="Medium"
            control={<Radio sx={{ '&.Mui-checked': { color: '#FFC107' } }} />}
            label="Medium"
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="Hard"
            control={<Radio sx={{ '&.Mui-checked': { color: '#F44336' } }} />}
            label="Hard"
            sx={{ mb: 1 }}
          />
        </RadioGroup>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{ mr: 2, borderRadius: 20, textTransform: 'none', padding: '8px 16px', border: '1px solid #ddd' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              borderRadius: 20,
              textTransform: 'none',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DifficultyModal;

/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from '../../redux/slices/feedback/userFeedback'; // Import submitFeedback action

const FeedbackModal = ({ open, handleClose }) => {
  const [rating, setRating] = useState(0); // Star rating
  const [comment, setComment] = useState(''); // Comment
  const dispatch = useDispatch(); // Get the dispatch function
  const { loading, successMessage, error } = useSelector((state) => state.feedback); // Get feedback state

  useEffect(() => {
    // Reset the state when the modal opens
    if (open) {
      setRating(0);
      setComment('');
      // Optionally reset other state here if needed
    }
  }, [open]);

  const handleStarClick = (index) => {
    setRating(index + 1); // Set rating based on the star clicked
  };

  const handleSubmit = () => {
    // Only submit feedback if the rating is set
    if (rating > 0) {
      // Prepare the feedback data
      const feedbackData = {
        rating,
        ...(comment && { comment }), // Include comment only if it's not empty
      };

      // Trigger feedback submission
      dispatch(submitFeedback(feedbackData)).then(() => {
        if (!error) {
          handleClose(); // Close modal on successful feedback submission
        }
      });
    }
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 4,
        boxShadow: 24,
        outline: 'none',
      }}>
        {/* Modal Heading */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Rate Your Experience
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Your feedback helps us improve. Please leave a rating and a comment.
        </Typography>

        {/* Star Rating */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {[...Array(5)].map((_, index) => (
            <IconButton
              key={index}
              onClick={() => handleStarClick(index)}
              sx={{
                color: index < rating ? 'primary.main' : 'action.disabled',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              {index < rating ? <StarIcon fontSize="large" /> : <StarBorderIcon fontSize="large" />}
            </IconButton>
          ))}
        </Box>

        {/* Optional Comment */}
        <TextField
          label="Optional Comment"
          multiline
          rows={4}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={rating === 0 || loading} // Disable when loading or no rating
          sx={{
            height: 45,
            fontWeight: 'bold',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
        </Button>

        {/* Success or Error Messages */}
        {successMessage && (
          <Typography variant="body2" sx={{ mt: 2, color: 'success.main', textAlign: 'center' }}>
            {successMessage}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" sx={{ mt: 2, color: 'error.main', textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};  

export default FeedbackModal;

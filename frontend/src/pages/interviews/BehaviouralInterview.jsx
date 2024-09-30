import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInterviews,addClick } from '../../redux/slices/behaviouralInterview/behaviouralInterview.slice';

const BehaviouralInterview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { allInterviews, loading, error } = useSelector((state) => state.behaviouralInterview || {}); // Ensure a fallback to {}

  useEffect(() => {
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  return (
    <Box
      sx={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        borderRadius: '20px',
      }}
      className="bg-white"
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#263238', mb: 4 }}
      >
        Start Your Behavioural Interview Adventure
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error}</Typography>}
        {allInterviews.length > 0 &&
          allInterviews.map((interview, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                    overflow: 'hidden',
                    maxWidth: 300,
                    height: 350,
                    margin: '0 auto',
                  }}
                >
                  {interview.picture && (
                    <CardMedia
                      component="img"
                      height="60"
                      image={interview.picture}
                      alt={`${interview.title} image`}
                      sx={{
                        objectFit: 'contain',
                        margin: '10px auto',
                        width: '60%',
                      }}
                    />
                  )}
                  <CardContent sx={{ padding: '8px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF4F', mb: 0.5 }}>
                      {interview.title}
                    </Typography>
                    <Typography variant="body2" color="blue-300" sx={{ mb: 1 }}>
                      {interview.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 1,
                        backgroundColor: '#4CAF4F',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        '&:hover': {
                          backgroundColor: '#388E3C',
                        },
                      }}
                      onClick={() => {
                        dispatch(addClick(interview._id))
                        navigate(`/dashboard/behavioural/${interview._id}`, { state: { interviewId: interview._id } });
}
                    }
                    >
                      Start Interview
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default BehaviouralInterview;

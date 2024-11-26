import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tilt from 'react-parallax-tilt';
import { fetchInterviewTopics,addClick } from '../../redux/slices/technicalInterview/technicalInterview.slice';

const Technical = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { topics, status, error } = useSelector((state) => state.interviewTopics);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInterviewTopics());
    }
  }, [status, dispatch]);

  return (
    <Box
      sx={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        borderRadius:'20px'
      
      }}
      className="bg-white "
    >
      {/*bg-gradient-to-t from-lime-100 to-cyan-100 */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#263238', mb: 4, fontFamily: 'cursive' }}

      >
        Start Your Technical Interview Adventure  
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography>Error: {error}</Typography>}
        {status === 'succeeded' &&
          topics.allInterviews.map((field, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {/* <Tilt
                glareEnable={true}
                glareMaxOpacity={0.3}
                scale={1.05}
                transitionSpeed={400}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                style={{ height: '100%' }}
              > */}
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
                      height: 360, 
                      margin: '0 auto', 
                    }}
                  >
                    {field.picture && (
                      <CardMedia
                        component="img"
                        height="60" 
                        image={field.picture}
                        alt={`${field.title} image`}
                        sx={{
                          objectFit: 'contain', 
                          margin: '10px auto',  
                          width: '60%', 
                        }}
                      />
                    )}
                    <CardContent
                      sx={{
                        padding: '8px', 
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF4F', mb: 0.5 }}>
                        {field.title}
                      </Typography>
                      <Typography variant="body2" color="blue-300" sx={{ mb: 1 }}>
                        {field.description}
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
                        onClick={() =>{
                          dispatch(addClick(field._id))
                           navigate(`/dashboard/instructions/${field._id}`)}}
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

export default Technical;

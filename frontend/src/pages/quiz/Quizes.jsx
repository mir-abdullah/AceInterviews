import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DifficultyModal from '../../components/modals/DifficultyModal';
import { getAllQuizTopics, getQuestionsByDifficulty } from '../../redux/slices/quiz/quiz.slice';

const Quizes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topics, status, error } = useSelector((state) => state.quizTopic);

  const [openModal, setOpenModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllQuizTopics());
    }
  }, [dispatch, status]);

  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setOpenModal(true);
  };

  const handleDifficultySelect = async (difficulty) => {
    setSelectedDifficulty(difficulty);
    setOpenModal(false);

    try {
      const resultAction = await dispatch(getQuestionsByDifficulty({ quizTopicId: selectedQuizId, difficulty }));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        const questionsData = resultAction.payload.questions;
        setQuestions(questionsData); // Store the questions
        navigate(`/dashboard/quiz/${selectedQuizId}`, {
          state: { difficulty, questions: questionsData }
        });
      } else {
        alert('Failed to fetch questions. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('An error occurred while fetching questions. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        borderRadius: '20px',
      }}
      className="bg-gradient-to-t from-lime-100 to-cyan-100"
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#263238', mb: 4, font: 'cursive' }}
      >
        Choose Your Quiz
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography>Error: {error}</Typography>}
        {status === 'succeeded' &&
          topics.allQuizTopics.map((quiz, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.3}
                scale={1.05}
                transitionSpeed={400}
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                style={{ height: '100%' }}
              >
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
                    {quiz.picture && (
                      <CardMedia
                        component="img"
                        height="60"
                        image={quiz.picture}
                        alt={`${quiz.title} image`}
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
                        {quiz.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {quiz.description}
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
                        onClick={() => handleStartQuiz(quiz._id)}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Tilt>
            </Grid>
          ))}
      </Grid>

      {/* Render the DifficultyModal */}
      <DifficultyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDifficultySelect={handleDifficultySelect}
        quizId={selectedQuizId}
      />
    </Box>
  );
};

export default Quizes;

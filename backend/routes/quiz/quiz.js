import express from 'express'
import { auth } from '../../middleware/auth.js';
import { submitAndEvaluateQuiz,getQuizResult,quizResults } from '../../controllers/quiz/quiz.js';
const router =express.Router();


//route to start quiz
router.post('/evaluate/:quizId',auth,submitAndEvaluateQuiz );

//route to get quiz  results 
router.get('/results',auth,quizResults)

//route to get single quiz result
router.get('/results/:quiz',auth,getQuizResult)

export default router
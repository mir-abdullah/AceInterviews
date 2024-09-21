import express from 'express'
import { auth } from '../../middleware/auth.js';
import { submitAndEvaluateQuiz,getQuizResult,quizResults,countQuizes } from '../../controllers/quiz/quiz.js';
const router =express.Router();


//route to start quiz
router.post('/evaluate/:quizTopicId',auth,submitAndEvaluateQuiz );

//route to get quiz  results 
router.get('/results',auth,quizResults)

//route to get single quiz result
router.get('/results/:quizId',auth,getQuizResult)

//count number of quiz given
router.get('/count',auth,countQuizes)

export default router
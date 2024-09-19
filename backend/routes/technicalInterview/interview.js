import express from 'express'
import { auth } from '../../middleware/auth.js';
import { startInterview,interviewResults ,getInterviewResult,countInterviews} from '../../controllers/technicalInterview/interview.js';

const router =express.Router();


//route to start interview
router.post('/start-interview/:interviewTopicId',auth,startInterview );

//route to get interview  results 
router.get('/results',auth,interviewResults)

//route to get single interview result
router.get('/results/:interviewId',auth,getInterviewResult)

// get total number of technical interviews given
router.get('/total-interviews',auth,countInterviews)

export default router



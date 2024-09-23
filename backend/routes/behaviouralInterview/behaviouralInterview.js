import express from 'express'
import { auth } from '../../middleware/auth.js';
import { startInterview,interviewResults,getInterviewResult,countInterviews,countBehaviouralInterviews } from '../../controllers/behaviouralInterview/behaviouralInterview.js';

const router =express.Router();


//route to start interview
router.post('/start-interview/:interviewTopicId',auth,startInterview );

//route to get interview  results 
router.get('/results',auth,interviewResults)

//route to get single interview result
router.get('/results/:interviewId',auth,getInterviewResult)

//count total number of interviews given by a user
router.get('/count',auth,countInterviews)

//count total overall interviews
router.get('/overall',countBehaviouralInterviews)

export default router



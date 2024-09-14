import express from 'express'
import { auth } from '../../middleware/auth.js'
import { submitFeedback,getAllFeedback } from '../../controllers/feedback/feedback.js'

const router =express.Router()

//submit feedback
router.post('/submit',auth,submitFeedback)

//get all feedback
router.get('/all',getAllFeedback)
import express from 'express'
import { auth } from '../../middleware/auth.js'
import { submitFeedback,getAllFeedback, getRatingsCount } from '../../controllers/feedback/feedback.js'

const router =express.Router()

//submit feedback
router.post('/submit',auth,submitFeedback)

//get all feedback
router.get('/all',getAllFeedback)

//get ratings

router.get('/ratings',getRatingsCount)

export default router;
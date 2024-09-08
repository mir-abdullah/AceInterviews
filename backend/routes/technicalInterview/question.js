import express from 'express'
import { addQuestion,deleteQuestion,updateQuestion } from '../../controllers/technicalInterview/question.js'

const router =express.Router()
//route to add a question
router.post('/:interviewId/add', addQuestion);

//route to delete a question
router.delete('/:interviewId/:questionId/delete', deleteQuestion );

//router to update a question
router.patch("/:interviewId/:questionId/update", updateQuestion);

export default router
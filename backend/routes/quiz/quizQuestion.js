import express from 'express'
import { addQuestion,deleteQuestion,updateQuestion } from '../../controllers/quiz/quizQuestion.js';
const router = express.Router()

//route to add a question
//route to add a question
router.post('/:quizId/add', addQuestion);

//route to delete a question
router.delete('/:quizId/:questionId/delete', deleteQuestion );

//router to update a question
router.patch("/:quizId/:questionId/update", updateQuestion);

export default router

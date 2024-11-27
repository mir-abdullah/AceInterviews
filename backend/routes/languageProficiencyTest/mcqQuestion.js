import express from 'express';
import {
  createMcqQuestion,
  getMcqQuestions,
  updateMcqQuestion,
  deleteMcqQuestion,
} from '../../controllers/languageProficiencyTest/mcqQuestion.js';

const router = express.Router();

// Create a new MCQ question
router.post('/', createMcqQuestion);

// Get all MCQ questions
router.get('/', getMcqQuestions);


// Update an MCQ question
router.put('/:id', updateMcqQuestion);

// Delete an MCQ question
router.delete('/:id', deleteMcqQuestion);

export default router;

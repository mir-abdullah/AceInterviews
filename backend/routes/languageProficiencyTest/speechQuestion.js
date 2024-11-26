import express from 'express';
import {
  createSpeechQuestion,
  getSpeechQuestions,
  getSpeechQuestionById,
  updateSpeechQuestion,
  deleteSpeechQuestion,
} from '../../controllers/languageProficiencyTest/speechQuestion.js';

const router = express.Router();

// Create a new Speech Question
router.post('/', createSpeechQuestion);

// Get all Speech Questions
router.get('/', getSpeechQuestions);

// Get a specific Speech Question by ID
router.get('/:id', getSpeechQuestionById);

// Update a Speech Question
router.put('/:id', updateSpeechQuestion);

// Delete a Speech Question
router.delete('/:id', deleteSpeechQuestion);

export default router;

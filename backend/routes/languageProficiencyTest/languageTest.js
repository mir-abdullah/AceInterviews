import express from 'express';
import { startTest, submitMcqAnswers, submitResponseAnswers, submitSpeechAnswers, getAllLanguageTestResults, getLanguageTestResult, countUserLanguageTests, countAllLanguageTests } from 
'../../controllers/languageProficiencyTest/languageTestResult.js';
import { auth } from '../../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/start', auth, startTest);
router.post('/mcq', auth, submitMcqAnswers);
router.post('/response', auth, submitResponseAnswers);
router.post('/speech', auth, submitSpeechAnswers);

// Get all tests results for the user
router.get('/results', auth, getAllLanguageTestResults);

// Get specific test result for the user
router.get('/result/:testId', auth, getLanguageTestResult);

// Count language tests for the user
router.get('/count', auth, countUserLanguageTests);

// Count all language tests
router.get('/count/all', countAllLanguageTests);

export default router;

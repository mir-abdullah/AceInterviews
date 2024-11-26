import LanguageTestResult from '../../models/languageProficiencyTest/languageTestResult.js';
import McqQuestion from '../../models/languageProficiencyTest/mcqQuestion.js';
import ResponseQuestion from '../../models/languageProficiencyTest/speechQuestion.js';
import SpeechQuestion from '../../models/languageProficiencyTest/speechQuestion.js';

import { v4 as uuidv4 } from 'uuid';


//start test
export const startTest = async (req, res) => {
  try {
    const { userId } = req.body;

    // Generate a unique test ID
    const testId = uuidv4();

    // Create an initial test result
    const testResult = new LanguageTestResult({
      testId,
      user: userId,
      stages: { mcq: [], response: [], speech: [] },
      score: 0,
      completed: false
    });

    await testResult.save();

    res.status(201).json({ msg: "Test started", testId });
  } catch (err) {
    console.error("Error starting test:", err);
    res.status(500).json({ msg: "Error starting test" });
  }
};

//mcq stage
export const submitMcqAnswers = async (req, res) => {
    try {
      const { testId, mcqAnswers } = req.body;
  
      const testResult = await LanguageTestResult.findOne({ testId });
      if (!testResult) {
        return res.status(404).json({ msg: "Test not found" });
      }
  
      let stageScore = 0;
  
      for (const answer of mcqAnswers) {
        const question = await McqQuestion.findById(answer.questionId);
        if (!question) {
          return res.status(404).json({ msg: "MCQ question not found" });
        }
  
        const correctOption = question.options.find(option => option.isCorrect === true).text;
        const isCorrect = answer.selectedOption === correctOption;
        if (isCorrect) {
          stageScore += 1;
        }
  
        testResult.stages.mcq.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          correctOption, // Save correct option
          isCorrect
        });
      }
  
      testResult.score += stageScore;
      await testResult.save();
  
      res.status(200).json({
        msg: "MCQ stage completed",
        stageScore,
        totalScore: testResult.score,
        mcqResults: testResult.stages.mcq
      });
    } catch (err) {
      console.error("Error submitting MCQ answers:", err);
      res.status(500).json({ msg: "Error submitting MCQ answers" });
    }
  };

 //response stage

 export const submitResponseAnswers = async (req, res) => {
    try {
      const { testId, responseAnswers } = req.body;
  
      const testResult = await LanguageTestResult.findOne({ testId });
      if (!testResult) {
        return res.status(404).json({ msg: "Test not found" });
      }
  
      let stageScore = 0;
  
      for (const answer of responseAnswers) {
        const question = await ResponseQuestion.findById(answer.questionId);
        if (!question) {
          return res.status(404).json({ msg: "Response question not found" });
        }
  
        const correctOption = question.options.find(option => option.isCorrect === true).text;
        const isCorrect = answer.selectedOption === correctOption;
        if (isCorrect) {
          stageScore += 1;
        }
  
        testResult.stages.response.push({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          correctOption, // Save correct option
          isCorrect
        });
      }
  
      testResult.score += stageScore;
      await testResult.save();
  
      res.status(200).json({
        msg: "Response stage completed",
        stageScore,
        totalScore: testResult.score,
        responseResults: testResult.stages.response
      });
    } catch (err) {
      console.error("Error submitting response answers:", err);
      res.status(500).json({ msg: "Error submitting response answers" });
    }
  };

//speech
export const submitSpeechAnswers = async (req, res) => {
  try {
    const { testId, speechAnswers } = req.body;

    const testResult = await LanguageTestResult.findOne({ testId });
    if (!testResult) {
      return res.status(404).json({ msg: "Test not found" });
    }

    for (const answer of speechAnswers) {
      const question = await SpeechQuestion.findById(answer.questionId);
      if (!question) {
        return res.status(404).json({ msg: "Speech question not found" });
      }

      const analysis = `Analysis of response: ${answer.transcribedText}`;

      testResult.stages.speech.push({
        questionId: answer.questionId,
        transcribedText: answer.transcribedText,
        analysis
      });
    }

    await testResult.save();

    res.status(200).json({ msg: "Speech stage completed", totalScore: testResult.score });
  } catch (err) {
    console.error("Error submitting speech answers:", err);
    res.status(500).json({ msg: "Error submitting speech answers" });
  }
};



// Get all language test results for a user
export const getAllLanguageTestResults = async (req, res) => {
  try {
    const userId = req.userId;

    const tests = await LanguageTestResult.find({ user: userId });

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: "No language tests found." });
    }

    return res.status(200).json(tests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single language test result
export const getLanguageTestResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.userId;

    const test = await LanguageTestResult.findOne({ _id: testId, user: userId });

    if (!test) {
      return res.status(404).json({ message: "Language test not found." });
    }

    return res.status(200).json(test);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Count the number of language tests given by a user
export const countUserLanguageTests = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await LanguageTestResult.countDocuments({ user: userId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Count all language tests
export const countAllLanguageTests = async (req, res) => {
  try {
    const count = await LanguageTestResult.countDocuments();

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  


import LanguageTestResult from '../../models/languageProficiencyTest/languageTestResult.js';
import McqQuestion from '../../models/languageProficiencyTest/mcqQuestion.js';
import ResponseQuestion from '../../models/languageProficiencyTest/responseQuestion.js';
import SpeechQuestion from '../../models/languageProficiencyTest/speechQuestion.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

//call model
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

//start test
export const startTest = async (req, res) => {
  try {
    const  userId  = req.userId;

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

    // Convert mcqAnswers object into an array of { questionId, selectedOption }
    const mcqAnswersArray = Object.entries(mcqAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));
    console.log(mcqAnswersArray); // Log to verify the incoming data

    // Find the LanguageTestResult by testId
    const testResult = await LanguageTestResult.findOne({ testId });
    if (!testResult) {
      return res.status(404).json({ msg: "Test not found" });
    }

    let stageScore = 0;
    const mcqResults = [];  // To hold results of mcq answers to push to the testResult

    // Iterate over the answers array
    for (let answer of mcqAnswersArray) {
      const question = await McqQuestion.findById(answer.questionId);
      if (!question) {
        return res.status(404).json({ msg: `MCQ question with ID ${answer.questionId} not found` });
      }

      // Find the correct option
      const correctOption = question.options.find(option => option.isCorrect === true)?.text;
      const isCorrect = answer.selectedOption === correctOption;

      if (isCorrect) {
        stageScore += 1;
      }

      // Prepare mcq result
      let mcqResult = {
        questionText: question.questionText,
        selectedOption: answer.selectedOption,
        correctOption,
        isCorrect
      };

      mcqResults.push(mcqResult);  // Store the result in an array
    }

    // Add MCQ results to the testResult
    testResult.mcq = mcqResults;  // You can overwrite or append to `mcq` here depending on your requirements

    // Update the total score
    testResult.score += stageScore;
    await testResult.save();  // Save the updated test result

    // Return the response
    res.status(200).json({
      msg: "MCQ stage completed",
      stageScore,
      totalScore: testResult.score,
      testResult
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

    // Convert responseAnswers object into an array of { questionId, selectedOption }
    const responseAnswersArray = Object.entries(responseAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    // Find the test result by testId
    const testResult = await LanguageTestResult.findOne({ testId });
    if (!testResult) {
      return res.status(404).json({ msg: "Test not found" });
    }

    let stageScore = 0;

    // Iterate over the answers array
    for (let answer of responseAnswersArray) {
      console.log(answer.questionId)
      // Find the question by questionId
      const question = await ResponseQuestion.findById(answer.questionId);
      if (!question) {
        return res.status(404).json({ msg: `Response question with ID ${answer.questionId} not found` });
      }

      // Find the correct option
      const correctOption = question.options.find(option => option.isCorrect === true)?.text;
      const isCorrect = answer.selectedOption === correctOption;

      if (isCorrect) {
        stageScore += 1;
      }

      // Create a response result object
      let responseResult = {
        questionId: question.questionAudio,
        selectedOption: answer.selectedOption,
        correctOption,
        isCorrect,
      };

      // Add the response result to the testResult's response stage
      testResult.response.push(responseResult);
    }

    // Update the total score
    testResult.score += stageScore;
    await testResult.save();

    // Return the response
    res.status(200).json({
      msg: "Response stage completed",
      totalScore: testResult.score,
      testResult
      
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

    // Convert speechAnswers object into an array of { questionId, transcribedText }
    const speechAnswersArray = Object.entries(speechAnswers).map(([questionId, transcribedText]) => ({
      questionId,
      transcribedText,
    }));

    // Find the test result by testId
    const testResult = await LanguageTestResult.findOne({ testId });
    if (!testResult) {
      return res.status(404).json({ msg: "Test not found" });
    }

    // Iterate over the answers array and process each answer
    for (let answer of speechAnswersArray) {
      console.log(answer.questionId);

      // Find the question by questionId
      const question = await SpeechQuestion.findById(answer.questionId);
      if (!question) {
        return res.status(404).json({ msg: `Speech question with ID ${answer.questionId} not found` });
      }

      // Evaluate language proficiency based on the transcribed text
      const { analysis } = await evaluateLanguageProficiency(answer.transcribedText);

      // Create a speech result object
      const speechResult = {
        questionText: question.text,
        transcribedText: answer.transcribedText,
        analysis,
      };

      // Add the speech result to the testResult's speech stage
      testResult.speech.push(speechResult);
    }

    // Mark the test as completed
    testResult.completed = true;

    // Save the test result with the new speech answers
    await testResult.save();

    // Return the response
    res.status(200).json({
      msg: "Speech stage completed",
      testResult,
    });
  } catch (err) {
    console.error("Error submitting speech answers:", err);
    res.status(500).json({ msg: "Error submitting speech answers" });
  }
};



// Language Proficiency Feedback Function
async function evaluateLanguageProficiency(text) {
  try {
    const prompt = `
      You are a language proficiency evaluator. Analyze the following text for grammar, fluency, vocabulary, and coherence.
      Text: "${text}"
      
      Provide detailed feedback explaining the strengths and weaknesses of the text, including specific examples of errors or areas needing improvement. 
      Focus on:
      - Grammar: Are there any grammatical mistakes?
      - Fluency: How smoothly do the sentences flow?
      - Vocabulary: Is the word choice diverse and appropriate?
      - Coherence: Does the text make logical sense and maintain a consistent structure?
      
      If the text is empty or incomplete, provide feedback indicating so and explain what a complete response might include.
      
      Provide your feedback in the following JSON format:
      {
        "type": "object",
        "properties": {
          "feedback": { "type": "string" }
        }
      }`;

    const result = await model.generateContent(prompt);

    // Get the feedback text from the model response
    const feedbackText = await result.response.text();
    const feedbackObject = JSON.parse(feedbackText);

    const analysis = feedbackObject.feedback;

    // Return the feedback
    return {
      analysis,
    };
  } catch (error) {
    console.error("Error evaluating language proficiency:", error.message);
    return {
      feedback: "Unable to evaluate language proficiency at this time. Please try again later.",
    };
  }
}



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

  


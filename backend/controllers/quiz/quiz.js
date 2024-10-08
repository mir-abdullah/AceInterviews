import QuizResult from "../../models/quiz/quiz.js";
import QuizQuestion from "../../models/quiz/quizQuestion.js";
import QuizTopic from "../../models/quiz/quizTopic.js";
import mongoose from "mongoose";

export const submitAndEvaluateQuiz = async (req, res) => {
  try {
    const { quizTopicId } = req.params;
    const { answers, difficulty } = req.body; // Expecting answers to be an object

    // Log the request body for debugging
    console.log(req.body);
    console.log(difficulty);

    // Ensure the answers object is valid
    if (typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid format for answers. It should be an object." });
    }

  
    // Find the quiz topic and populate questions
    const quizTopic = await QuizTopic.findById(quizTopicId).populate('questions');

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz topic not found" });
    }

    let score = 0;
    const answerResults = [];

    // Iterate through the answers object
    for (const [questionId, selectedOption] of Object.entries(answers)) {
      // Log each questionId and selectedOption for debugging
      console.log(`Processing questionId: ${questionId}, selectedOption: ${selectedOption}`);

      // Validate that questionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ message: `Invalid question ID: ${questionId}` });
      }

      // Find the question by ID
      const question = await QuizQuestion.findById(questionId);

      if (!question) {
        return res.status(400).json({ message: `Question not found: ${questionId}` });
      }

      // Find the correct option for the question
      const correctOption = question.options.find(option => option.isCorrect);

      if (!correctOption) {
        return res.status(400).json({ message: `No correct option for question: ${questionId}` });
      }

      // Compare selected option with correct option value
      const isCorrect = selectedOption === correctOption.text; // Assuming `text` holds the answer
      if (isCorrect) score++;

      answerResults.push({
        question: question.questionText,
        selectedOption,
        correctOption: correctOption.text, // Save the correct answer's text
        isCorrect,
      });
    }

    // Store the result in QuizResult
    const quizResult = await QuizResult.create({
      user: req.userId, // Assuming user is authenticated
      topic: quizTopicId,
      answers: answerResults,
      score,
    });

    res.status(200).json({ message: "Quiz submitted and evaluated", quizResult });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error: error.message });
  }
};





//get all quizes results
export const quizResults = async (req, res) => {
    try {
      // Destructure userId from the request object
      const userId = req.userId;
  
      // Fetch interviews for the specific user
      const quizes = await QuizResult.find({ user: userId }).populate('topic' ,'title picture');
  
      // Check if no interviews are found
      if (!quizes || quizes.length === 0) {
        return res.status(404).json({ message: "No quiz found." });
      }
  
      // Return the interviews if found
      return res.status(200).json(quizes);
    } catch (error) {
      // Return a 500 error if something goes wrong
      return res.status(500).json({ message: error.message });
    }
  };
  
  //get a single quiz result
  export const getQuizResult = async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.userId;
      const quiz = await QuizResult.find({ user: userId, _id: quizId });

      if (!quiz || quiz.length === 0) {
        return res.status(404).json({ message: "No quiz found." });
      }
      return res.status(200).json(quiz);
    } catch (error) {
      // Return a 500 error if something goes wrong
      return res.status(500).json({ message: error.message });
    }
  };

  //count number of quiz given by a user
  export const countQuizes = async (req, res) => {
    try {
      // Destructure userId from the request object
      const userId = req.userId;
  
      // Fetch the count of interviews for the specific user
      const count = await QuizResult.countDocuments({ user: userId });
  
      // Return the count as a JSON object
      return res.status(200).json({ count });
    } catch (error) {
      // Return the error message
      return res.status(500).json({ message: error.message });
    }
  };
  
  //count all quizes
  export const countAllQuizes = async (req, res) => {
    try{
      const count = await QuizResult.countDocuments( );
  
      // Return the count as a JSON object
      return res.status(200).json({ count });
    } catch (error) {
      // Return the error message
      return res.status(500).json({ message: error.message });
    }
    }
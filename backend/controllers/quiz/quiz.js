import QuizResult from "../../models/quiz/quiz.js";
import QuizQuestion from "../../models/quiz/quizQuestion.js";
import QuizTopic from "../../models/quiz/quizTopic.js";
import mongoose from "mongoose";

export const submitAndEvaluateQuiz = async (req, res) => {
  try {
    const { quizTopicId } = req.params;
    const { answers, difficulty } = req.body;

    console.log(req.body);
    console.log(difficulty);

    if (typeof answers !== "object" || Array.isArray(answers)) {
      return res
        .status(400)
        .json({
          message: "Invalid format for answers. It should be an object.",
        });
    }

    const quizTopic = await QuizTopic.findById(quizTopicId).populate(
      "questions"
    );

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz topic not found" });
    }

    let score = 0;
    const answerResults = [];

    // Iterate through the answers object
    for (const [questionId, selectedOption] of Object.entries(answers)) {
      // Log each questionId and selectedOption for debugging

      // Validate that questionId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res
          .status(400)
          .json({ message: `Invalid question ID: ${questionId}` });
      }

      const question = await QuizQuestion.findById(questionId);

      if (!question) {
        return res
          .status(400)
          .json({ message: `Question not found: ${questionId}` });
      }

      const correctOption = question.options.find((option) => option.isCorrect);

      if (!correctOption) {
        return res
          .status(400)
          .json({ message: `No correct option for question: ${questionId}` });
      }

      const isCorrect = selectedOption === correctOption.text;
      if (isCorrect) score++;

      answerResults.push({
        question: question.questionText,
        selectedOption,
        correctOption: correctOption.text,
        isCorrect,
      });
    }

    // Store the result in QuizResult
    const quizResult = await QuizResult.create({
      user: req.userId,
      topic: quizTopicId,
      answers: answerResults,
      score,
    });

    res
      .status(200)
      .json({ message: "Quiz submitted and evaluated", quizResult });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting quiz", error: error.message });
  }
};

//get all quizes results
export const quizResults = async (req, res) => {
  try {
    const userId = req.userId;

    const quizes = await QuizResult.find({ user: userId }).populate(
      "topic",
      "title picture"
    );

    if (!quizes || quizes.length === 0) {
      return res.status(404).json({ message: "No quiz found." });
    }

    return res.status(200).json(quizes);
  } catch (error) {
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
    return res.status(500).json({ message: error.message });
  }
};

//count number of quiz given by a user
export const countQuizes = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await QuizResult.countDocuments({ user: userId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//count all quizes
export const countAllQuizes = async (req, res) => {
  try {
    const count = await QuizResult.countDocuments();

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import QuizResult from "../../models/quiz/quiz.js";
import QuizQuestion from "../../models/quiz/quizQuestion.js";
import QuizTopic from "../../models/quiz/quizTopic.js";


export const submitAndEvaluateQuiz = async (req, res) => {
    try {
      const { quizTopicId } = req.params;
      const { answers } = req.body; // answers should be an array of {questionId, selectedOption}
  
      // Find the quiz topic and populate questions
      const quizTopic = await QuizTopic.findById(quizTopicId).populate('questions');
  
      if (!quizTopic) {
        return res.status(404).json({ message: "Quiz topic not found" });
      }
  
      let score = 0;
      const answerResults = [];
  
      for (let answer of answers) {
        // Find the question and populate options
        const question = await QuizQuestion.findById(answer.questionId);
  
        if (!question) {
          return res.status(400).json({ message: `Invalid question: ${answer.questionId}` });
        }
  
        // Find the correct option for the question
        const correctOption = question.options.find(option => option.isCorrect);
        if (!correctOption) {
          return res.status(400).json({ message: `No correct option for question: ${answer.questionId}` });
        }
  
        // Compare selected option with correct option value
        const isCorrect = answer.selectedOption === correctOption.value;
        if (isCorrect) score++;
  
        answerResults.push({
          question: question._id,
          selectedOption: answer.selectedOption,
          correctOption: correctOption.value,
          isCorrect,
        });
      }
  
      // Store the result in QuizResult
      const quizResult = await QuizResult.create({
        userId: req.user._id, // Assuming user is authenticated
        quizTopic: quizTopicId,
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
      const quizes = await QuizResult.find({ user: userId });
  
      // Check if no interviews are found
      if (!quizes || quizes.length === 0) {
        return res.status(404).json({ message: "No interviews found." });
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

  //count number of quiz given
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
  
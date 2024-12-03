import InterviewTopic from "../../models/technicalInterview/interviewTopic.js";
import Interview from "../../models/technicalInterview/interview.js";
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

// Route to start an interview
export const startInterview = async (req, res) => {
  try {
    const { interviewTopicId } = req.params;
    const userId = req.userId;
    const { answers, difficulty } = req.body;

    // Find the interview topic and populate the questions
    const interviewTopic = await InterviewTopic.findById(
      interviewTopicId
    ).populate("questions");

    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    let questions = interviewTopic.questions;

    // Filter questions based on difficulty
    if (difficulty) {
      questions = questions.filter((question) => {
        return question.difficulty === difficulty;
      });

      if (questions.length === 0) {
        return res
          .status(404)
          .json({
            message: "No questions found for the selected difficulty level",
          });
      }
    }

    const interview = new Interview({
      user: userId,
      topic: interviewTopicId,
      responses: [],
      totalScore: 0,
    });

    for (let question of questions) {
      const userAnswer = answers[question._id];

      const evaluation = await evaluateAnswer(question.text, userAnswer);

      // Ensure that the score is a valid number
      const score = isNaN(Number(evaluation.score)) ? 0 : Number(evaluation.score);

      interview.responses.push({
        question: question.text,
        answer: userAnswer,
        evaluation: {
          score: score,
          feedback: evaluation.feedback,
          idealAnswer: evaluation.idealAnswer,
        },
      });

      // Add score to totalScore
      interview.totalScore += score;
    }

    await interview.save();

    res
      .status(200)
      .json({ message: "Interview completed successfully", interview });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starting interview", error: error.message });
  }
};


// Evaluation function
async function evaluateAnswer(question, answer) {
  try {
    const prompt = `
      You are an expert evaluator. Please evaluate the following answer based on the given question.
      Question: ${question}
      Answer: ${answer}
      Provide a score from 1 to 5, and include detailed feedback with your evaluation.If user answer is empty mark it zero.
      provide an ideal answer also.
      Provide your evaluation in the following JSON format:
      { "type" :"object",
       "properties":{
       "score" : {"type" : "integer"},
       "feedback" : {"type" : "string"},
       "idealAnswer" : {"type" :"string"},
       }
       
      }`;

    const result = await model.generateContent(prompt);

    // if (
    //   !result ||
    //   !result.response ||
    //   typeof result.response.text !== "function"
    // ) {
    //   throw new Error("Invalid response from the AI model.");
    // }

    // Get the evaluation text from the model response
    const evaluationText = await result.response.text();
    const evaluation = JSON.parse(evaluationText);
    const score = evaluation.score; // Converts to number, or NaN if invalid
    const feedback = evaluation.feedback;
    const idealAnswer = evaluation.idealAnswer;
    // console.log(score);
    // console.log(feedback);
    // console.log(idealAnswer)

    // Return
    return {
      score,
      feedback,
      idealAnswer,
    };
  } catch (error) {
    console.error("Error evaluating answer:", error.message);
    return {
      score: 0,
      feedback: "Unable to evaluate answer at this time",
    };
  }
}

//get all interview results
export const interviewResults = async (req, res) => {
  try {
    const userId = req.userId;

    const interviews = await Interview.find({ user: userId }).populate(
      "topic",
      "title picture"
    );
    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found." });
    }

    // Return the interviews with topic details
    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get a single interview result
export const getInterviewResult = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.userId;
    const interview = await Interview.findOne({
      user: userId,
      _id: interviewId,
    });
    // Check if no interview is found
    if (!interview || interview.length === 0) {
      return res.status(404).json({ message: "No interview found." });
    }

    return res.status(200).json(interview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//count number of interviews given by user
export const countInterviews = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await Interview.countDocuments({ user: userId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//count total overall interviews
export const countTechnicalInterviews = async (req, res) => {
  try {
    const count = await Interview.countDocuments();

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

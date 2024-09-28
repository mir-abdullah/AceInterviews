import express from "express";
import User from "../../models/user/user.js";
import InterviewTopic from "../../models/technicalInterview/interviewTopic.js";
import Interview from "../../models/technicalInterview/interview.js";
import { auth } from "../../middleware/auth.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai";

dotenv.config();

const router = express.Router();


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    // responseSchema:{
    //     type: SchemaType.OBJECT,
    //     properties:{
    //         score:{
    //             type: SchemaType.NUMBER
    //         },
    //         feedback:{
    //             type: SchemaType.STRING
    //         },
    //     },

    // }
  },
});

// Route to start an interview
export const startInterview = async (req, res) => {
  try {
    const { interviewTopicId } = req.params;
    const userId = req.userId;
    const { answers, difficulty } = req.body; // Include difficulty in the request body

    // Find the interview topic and populate the questions
    const interviewTopic = await InterviewTopic.findById(
      interviewTopicId
    ).populate("questions");

    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    // Retrieve the questions from the interview topic
    let questions = interviewTopic.questions;

    // Filter questions based on the selected difficulty level
    if (difficulty) {
      questions = questions.filter((question) => {
        return question.difficulty === difficulty; // Filter questions by difficulty
      });

      if (questions.length === 0) {
        return res
          .status(404)
          .json({ message: "No questions found for the selected difficulty level" });
      }
    }

    // Create a new interview document
    const interview = new Interview({
      user: userId,
      topic: interviewTopicId,
      responses: [],
      totalScore: 0, // Initialize totalScore
    });

    // Iterate over the filtered questions and evaluate the answers
    for (let question of questions) {
      const userAnswer = answers[question._id]; // Retrieve user's answer for this question

      // Evaluate the answer using the Gemini API (this should be a function you have implemented elsewhere)
      const evaluation = await evaluateAnswer(question.text, userAnswer);

      // Add the question, user's answer, and evaluation to the interview responses
      interview.responses.push({
        question: question.text,
        answer: userAnswer,
        evaluation: {
          score: evaluation.score,
          feedback: evaluation.feedback,
          idealAnswer: evaluation.idealAnswer,
        },
      });

      // Update the total score
      interview.totalScore += evaluation.score;
    }

    // Save the interview to the database
    await interview.save();

    res.status(200).json({ message: "Interview completed successfully", interview });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starting interview", error: error.message });
  }
};


// Evaluation function
async function evaluateAnswer(question, answer) {
  try {
    // Construct the prompt for evaluation with a request for structured JSON format
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

    // Generate the evaluation content
    const result = await model.generateContent(prompt);

    // Ensure the result is valid
    if (
      !result ||
      !result.response ||
      typeof result.response.text !== "function"
    ) {
      throw new Error("Invalid response from the AI model.");
    }

    // Get the evaluation text from the model response
    const evaluationText = await result.response.text();
    const evaluation = JSON.parse(evaluationText);
    const score = evaluation.score;
    const feedback = evaluation.feedback;
    const idealAnswer = evaluation.idealAnswer;
    // console.log(score);
    // console.log(feedback);
    // console.log(idealAnswer)

    // Return the structured evaluation
    return {
      score,
      feedback,
      idealAnswer
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
    // Destructure userId from the request object
    const userId = req.userId;

    // Fetch interviews for the specific user and populate topicTitle and picture from the related Topic collection
    const interviews = await Interview.find({ user: userId })
      .populate('topic', 'title picture') // Assuming 'topic' is the reference field

    // Check if no interviews are found
    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found." });
    }

    // Return the interviews with topic details
    return res.status(200).json(interviews);
  } catch (error) {
    // Return a 500 error if something goes wrong
    return res.status(500).json({ message: error.message });
  }
};


//get a single interview result
export const getInterviewResult = async (req, res) => {
  try {
    // Destructure interviewId from the request object
    const { interviewId } = req.params;
    const userId = req.userId;
    // Fetch the interview result for the specific user and interview
    const interview = await Interview.findOne({ user: userId, _id: interviewId });
    // Check if no interview is found
    if (!interview || interview.length === 0) {
      return res.status(404).json({ message: "No interview found." });
    }
    // Return the interview if found
    return res.status(200).json(interview);
  } catch (error) {
    // Return a 500 error if something goes wrong
    return res.status(500).json({ message: error.message });
  }
};

//count number of interviews given by user
export const countInterviews = async (req, res) => {
  try {
    // Destructure userId from the request object
    const userId = req.userId;

    // Fetch the count of interviews for the specific user
    const count = await Interview.countDocuments({ user: userId });

    // Return the count as a JSON object
    return res.status(200).json({ count });
  } catch (error) {
    // Return the error message
    return res.status(500).json({ message: error.message });
  }
};

//count total overall interviews
export const countTechnicalInterviews = async (req, res) => {
  try{
    const count = await Interview.countDocuments( );

    // Return the count as a JSON object
    return res.status(200).json({ count });
  } catch (error) {
    // Return the error message
    return res.status(500).json({ message: error.message });
  }
  }


import BehaviourInterviewTopic from "../../models/behaviouralInterview/behaviourTopic.js";
import Question from "../../models/behaviouralInterview/behaviouralQuestion.js";
import behaviouralInterview from "../../models/behaviouralInterview/behaviouralInterview.js";
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

//start interview
export const startInterview = async (req, res) => {
  try {
    const { interviewTopicId } = req.params;
    const userId = req.userId;
    const { answers } = req.body;
    console.log("Answers received:", answers);

    const interviewTopic = await BehaviourInterviewTopic.findById(
      interviewTopicId
    ).populate("questions");

    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    const questions = interviewTopic.questions;
    // console.log("Questions:", questions);

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this interview topic." });
    }

    const interview = new behaviouralInterview({
      user: userId,
      topic: interviewTopicId,
      responses: [],
     
    });

    for (let question of questions) {
      // Convert question ID to string to match object keys
      const questionId = question._id.toString();
      const userResponse = answers[questionId];

      if (!userResponse) {
        console.error(`No response found for question ID: ${questionId}`);
        continue; // Skip this question
      }

      const { answer, statusCounts } = userResponse;

      const evaluation = await evaluateAnswer(
        question.text,
        answer,
        statusCounts
      );

      interview.responses.push({
        question: question.text,
        answer,
        evaluation: {
          feedback: evaluation.accuracyOfAnswer,
          confidence: evaluation.confidence,
          IdealAnswer: evaluation.tipsAndIdealAnswer,
          // statusCounts,
        },
      });
    }

    await interview.save();

    res
      .status(200)
      .json({ message: "Interview completed successfully", interview });
  } catch (error) {
    console.error("Error starting interview:", error);
    res
      .status(500)
      .json({ message: "Error starting interview", error: error.message });
  }
};



// Evaluation function
async function evaluateAnswer(question, answer, statusCounts) {
  try {
    const { Attentive, Distracted, Drowsy } = statusCounts;

    const prompt = `
      You are an expert evaluator. Please evaluate the following answer based on the given question.
      Question: ${question}
      Answer: ${answer}
      The user's attentiveness during the answer is provided below:
      - Attentive instances: ${Attentive}
      - Distracted instances: ${Distracted}
      - Drowsy instances: ${Drowsy}

      Based on this information:
      1. Provide an evaluation of the user's confidence level considering attentiveness, distraction, and drowsiness counts.
      2. Evaluate the accuracy and quality of the answer.
      3. Suggest improvements and provide an ideal answer.

      Provide your evaluation in the following JSON format:
      {
        "accuracyOfAnswer": "string",
        "confidence": "string",
        "tipsAndIdealAnswer": "string"
      }
    `;

    const result = await model.generateContent(prompt);

    if (
      !result ||
      !result.response ||
      typeof result.response.text !== "function"
    ) {
      throw new Error("Invalid response from the AI model.");
    }

    const evaluationText = await result.response.text();

    const evaluation = JSON.parse(evaluationText);

    const accuracyOfAnswer = evaluation.accuracyOfAnswer || "N/A";
    const confidence = evaluation.confidence || "N/A";
    const tipsAndIdealAnswer = evaluation.tipsAndIdealAnswer || "N/A";

    return {
      accuracyOfAnswer,
      confidence,
      tipsAndIdealAnswer,
    };
  } catch (error) {
    console.error("Error evaluating answer:", error.message);
    return {
      accuracyOfAnswer: "N/A",
      confidence: "Unable to evaluate due to an error",
      tipsAndIdealAnswer: "Unable to evaluate answer at this time",
    };
  }
}


//get all interview results
export const interviewResults = async (req, res) => {
  try {
    const userId = req.userId;

    const interviews = await behaviouralInterview
      .find({ user: userId })
      .populate("topic", "title picture");

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found." });
    }

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
    const interview = await behaviouralInterview.findOne({
      user: userId,
      _id: interviewId,
    });
    if (!interview || interview.length === 0) {
      return res.status(404).json({ message: "No interview found." });
    }
    return res.status(200).json(interview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//count number of behavioural interviews given by user
export const countInterviews = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await behaviouralInterview.countDocuments({ user: userId });

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//count interviews overall
export const countBehaviouralInterviews = async (req, res) => {
  try {
    const count = await behaviouralInterview.countDocuments();

    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

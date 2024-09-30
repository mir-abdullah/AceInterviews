import BehaviourInterviewTopic from "../../models/behaviouralInterview/behaviourTopic.js";
import Question from "../../models/behaviouralInterview/behaviouralQuestion.js";
import behaviouralInterview from "../../models/behaviouralInterview/behaviouralInterview.js";

//start interview
export const startInterview = async (req, res) => {
  try {
    const { interviewTopicId } = req.params;
    const userId = req.userId;
    const { answers } = req.body;

    const interviewTopic = await BehaviourInterviewTopic.findById(
      interviewTopicId
    ).populate("questions");
    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    const questions = interviewTopic.questions;

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this interview topic." });
    }

    const interview = new behaviouralInterview({
      user: userId,
      topic: interviewTopicId,
      responses: [],
      totalScore: 0,
    });

    // Iterate over the questions and evaluate the answers
    for (let question of questions) {
      const userAnswer = answers[question._id];

      const evaluation = await evaluateAnswer(question.text, userAnswer);

      interview.responses.push({
        question: question.text,
        answer: userAnswer,
        evaluation: {
          accuracyOfAnswer: evaluation.accuracyOfAnswer,
          speechAndGrammarAnalysis: evaluation.speechAndGrammarAnalysis,
          speechQualityAndConfidence: evaluation.speechQualityAndConfidence,
          tipsAndIdealAnswer: evaluation.tipsAndIdealAnswer,
        },
      });
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
        Provide a detailed feedback with your evaluation.
        Your evaluation should focus on the following aspects:
           1. Accuracy of the answer.
           2. Speech and grammar analysis.
           3. Speech quality and confidence.
           4. Tips for improvement and the ideal answer.
        Provide your evaluation in the following JSON format:
        
         evaluation ={
         "accuracyOfAnswer" :  "string",
         "speechAndGrammarAnalysis"  : "string",
         "speechQualityAndConfidence" : "string",
         "tipsAndIdealAnswer" :  "string",
       
         }
        }`;

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

    const accuracyOfAnswer = evaluation.accuracyOfAnswer;
    const speechAndGrammarAnalysis = evaluation.speechAndGrammarAnalysis;
    const speechQualityAndConfidence = evaluation.speechQualityAndConfidence;
    const tipsAndIdealAnswer = evaluation.tipsAndIdealAnswer;

    // Return
    return {
      accuracyOfAnswer,
      speechAndGrammarAnalysis,
      speechQualityAndConfidence,
      tipsAndIdealAnswer,
    };
  } catch (error) {
    console.error("Error evaluating answer:", error.message);
    return {
      accuracyOfAnswer: "N/A",
      speechAndGrammarAnalysis: "N/A",
      speechQualityAndConfidence: "N/A",
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

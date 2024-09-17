import BehaviourInterviewTopic from "../../models/behaviouralInterview/behaviourTopic.js";
import Question from "../../models/behaviouralInterview/behaviouralQuestion.js";
import behaviouralInterview from "../../models/behaviouralInterview/behaviouralInterview.js";

export const startInterview = async (req, res) => {
  try {
    const { interviewTopicId } = req.params;
    const userId = req.userId;
    const { answers } = req.body;

    // Find the interview topic and populate the questions
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

    // Create a new interview document
    const interview = new behaviouralInterview({
      user: userId,
      topic: interviewTopicId,
      responses: [],
      totalScore: 0, // Initialize totalScore
    });

    // Iterate over the questions and evaluate the answers
    for (let question of questions) {
      const userAnswer = answers[question._id]; // Retrieve user's answer for this question

      // Evaluate the answer using the Gemini API
      const evaluation = await evaluateAnswer(
        question.text,
        userAnswer
      );

      // Add the question, user's answer, and evaluation to the interview responses
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

    // Save the interview to the database
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
    // Construct the prompt for evaluation with a request for structured JSON format
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

    // Generate the evaluation content
    const result = await model.generateContent(prompt);

    // Ensure the result is valid and the content is returned properly
      // Ensure the result is valid
      if (
        !result ||
        !result.response ||
        typeof result.response.text !== "function"
      ) {
        throw new Error("Invalid response from the AI model.");
      }
  

    // The result is likely already in the desired format, so you can directly parse it
    const evaluationText = await result.response.text();
    
    const evaluation = JSON.parse(evaluationText);
  

    const accuracyOfAnswer = evaluation.accuracyOfAnswer;
    const speechAndGrammarAnalysis = evaluation.speechAndGrammarAnalysis;
    const speechQualityAndConfidence = evaluation.speechQualityAndConfidence;
    const tipsAndIdealAnswer = evaluation.tipsAndIdealAnswer;
    

    // Return the structured evaluation
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
      tipsAndIdealAnswer: "Unable to evaluate answer at this time"
    };
  }
}

//get all interview results
export const interviewResults = async (req, res) => {
    try {
      // Destructure userId from the request object
      const userId = req.userId;
  
      // Fetch interviews for the specific user
      const interviews = await behaviouralInterview.find({ user: userId });
  
      // Check if no interviews are found
      if (!interviews || interviews.length === 0) {
        return res.status(404).json({ message: "No interviews found." });
      }
  
      // Return the interviews if found
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
      const interview = await behaviouralInterview.findOne({ user: userId, _id: interviewId });
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
import BehaviourInterviewTopic from "../../models/behaviouralInterview/behaviourTopic.js";
import BehaviourQuestion from "../../models/behaviouralInterview/behaviouralQuestion.js";

// Route to add a question
export const addQuestion = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interviewTopic = await BehaviourInterviewTopic.findById(interviewId);
    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newQuestion = new BehaviourQuestion({
      text,
    });
    await newQuestion.save();

    interviewTopic.questions.push(newQuestion._id);
    await interviewTopic.save();

    res
      .status(201)
      .json({
        message: "Question added to the interview topic",
        interviewTopic,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding question to interview topic", error });
    console.log(error);
  }
};

// Route to delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { interviewId, questionId } = req.params;

    const interviewTopic = await BehaviourInterviewTopic.findById(interviewId);
    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    const question = await BehaviourQuestion.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    interviewTopic.questions.pull(questionId);
    await interviewTopic.save();

    res
      .status(200)
      .json({ message: "Question deleted from the interview topic" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting question from interview topic", error });
  }
};

// Route to update a question
export const updateQuestion = async (req, res) => {
  try {
    const { interviewId, questionId } = req.params;
    const interviewTopic = await BehaviourInterviewTopic.findById(interviewId);
    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    const { text, difficulty } = req.body;
    const question = await BehaviourQuestion.findByIdAndUpdate(
      questionId,
      { text },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Question updated in the interview topic", question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating question in interview topic", error });
  }
};

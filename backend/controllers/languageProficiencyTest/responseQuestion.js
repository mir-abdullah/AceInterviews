import cloudinary from "../../utils/cloudinaryConfig.js";
import ResponseQuestion from "../../models/languageProficiencyTest/responseQuestion.js";


// Create a New Question
export const createQuestion = async (req, res) => {
  try {
    const { options } = req.body;
    const questionAudio = req.body.questionAudio;

    if (!questionAudio) {
      return res.status(400).json({ msg: "No audio file provided" });
    }

    // Upload the audio file to Cloudinary
    const result = await cloudinary.uploader.upload(questionAudio, {
      resource_type: "video", // Treat audio files as video in Cloudinary
      folder: "question_audio_files",
    });

    // Create the question in the database
    const newQuestion = new ResponseQuestion({
      questionAudio: result.secure_url,
      options,
    });

    await newQuestion.save();

    res.status(201).json({ msg: "Question created successfully", question: newQuestion });
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ msg: "Error creating question", error: err.message });
  }
};

// Get All Questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await ResponseQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ msg: "Error fetching questions", error: err.message });
  }
};

// Get Question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await ResponseQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.status(200).json(question);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ msg: "Error fetching question", error: err.message });
  }
};

// Update Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { options } = req.body;
    const questionAudio = req.body.questionAudio;

    const question = await ResponseQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Update question fields
    if (questionAudio) {
      // Upload the new audio file to Cloudinary
      const result = await cloudinary.uploader.upload(questionAudio, {
        resource_type: "video",
        folder: "question_audio_files",
      });
      question.questionAudio = result.secure_url;
    }

    if (options) question.options = options;

    await question.save();

    res.status(200).json({ msg: "Question updated successfully", question });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ msg: "Error updating question", error: err.message });
  }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await ResponseQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    await question.remove();

    res.status(200).json({ msg: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ msg: "Error deleting question", error: err.message });
  }
};

import SpeechQuestion from '../../models/languageProficiencyTest/speechQuestion.js';

// Create a new Speech Question
export const createSpeechQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const newSpeechQuestion = new SpeechQuestion({ text });

    const savedQuestion = await newSpeechQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Speech Questions
export const getSpeechQuestions = async (req, res) => {
  try {
    const questions = await SpeechQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific Speech Question by ID
export const getSpeechQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await SpeechQuestion.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Speech question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Speech Question
export const updateSpeechQuestion = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedQuestion = await SpeechQuestion.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Speech question not found' });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Speech Question
export const deleteSpeechQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await SpeechQuestion.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Speech question not found' });
    }

    res.status(200).json({ message: 'Speech question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

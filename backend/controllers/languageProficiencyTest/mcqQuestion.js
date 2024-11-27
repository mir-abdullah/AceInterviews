import McqQuestion from '../../models/languageProficiencyTest/mcqQuestion.js';

// Create a new MCQ question
export const createMcqQuestion = async (req, res) => {
  try {
    const { questionText, options } = req.body;
    const newQuestion = new McqQuestion({
      questionText,
      options,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all MCQ questions
export const getMcqQuestions = async (req, res) => {
  try {
    const questions = await McqQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update an MCQ question
export const updateMcqQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options } = req.body;

  try {
    const updatedQuestion = await McqQuestion.findByIdAndUpdate(
      id,
      { questionText, options },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an MCQ question
export const deleteMcqQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await McqQuestion.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import express from "express";
import QuizTopic from "../../models/quiz/quizTopic.js";
import QuizQuestion from "../../models/quiz/quizQuestion.js";


// Route to add a quiz topic with an image upload
export const addQuizTopic = async (req, res) => {
  try {
    const { title, description } = req.body;
    let picture = null;

    // Check if an image file is uploaded
    if (req.file) {
      picture = req.file.path; // Assuming the Cloudinary URL is stored in req.file.path
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const newQuizTopic = await QuizTopic.create({
      title,
      description,
      picture, // Store the image URL in the picture field
    });

    res
      .status(201)
      .json({ message: "Quiz Topic added successfully", newQuizTopic });
  } catch (error) {
    res.status(500).send("Something Went Wrong. Try again later.");
  }
};

// Route to get all quiz topics
export const getAllQuizTopics = async (req, res) => {
  try {
    const allQuizTopics = await QuizTopic.find();
    res.status(200).json({ message: "All Quiz Topics", allQuizTopics });
  } catch (error) {
    res.status(500).send("Something Went Wrong. Try again later.");
  }
};

// Route to get a specific quiz topic with questions
export const getQuizTopic = async (req, res) => {
  try {
    const { quizTopicId } = req.params;

    const quizTopic = await QuizTopic.findById(quizTopicId).populate("questions");

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz Topic not found" });
    }

    res.status(200).json({ message: "Quiz Topic Retrieved", quizTopic });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

// Route to edit a quiz topic
export const editQuizTopic = async (req, res) => {
  try {
    const { quizTopicId } = req.params;
    const { title, description } = req.body;
    let picture = req.file ? req.file.path : undefined; // Only update picture if a new one is uploaded

    const updatedQuizTopic = await QuizTopic.findByIdAndUpdate(
      quizTopicId,
      { title, description, picture },
      { new: true, runValidators: true }
    );

    if (!updatedQuizTopic) {
      return res.status(404).json({ message: "Quiz Topic not found" });
    }

    res.status(200).json({ message: "Quiz Topic Updated", updatedQuizTopic });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation Error", error });
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

// Route to delete a quiz topic
export const deleteQuizTopic = async (req, res) => {
  try {
    const { quizTopicId } = req.params;

    const quizTopic = await QuizTopic.findById(quizTopicId);

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz Topic not found" });
    }

    await QuizQuestion.deleteMany({ _id: { $in: quizTopic.questions } });

    await QuizTopic.findByIdAndDelete(quizTopicId);

    res.status(200).json({ message: "Quiz Topic and associated questions deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

// Route to get quiz questions by difficulty
export const getQuestionsByDifficulty = async (req, res) => {
  try {
    const { quizTopicId } = req.params;
    const { difficulty } = req.body;

    // Validate quizTopicId
    if (!quizTopicId) {
      return res.status(400).json({ message: "Quiz Topic ID is required" });
    }

    const quizTopic = await QuizTopic.findById(quizTopicId).populate("questions");

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz Topic not found" });
    }

    let questions = quizTopic.questions;

    if (difficulty) {
      const validDifficulties = ["Easy", "Medium", "Hard"];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty level" });
      }

      questions = questions.filter((question) => question.difficulty === difficulty);
    }

    res.status(200).json({
      message: "Quiz Topic retrieved successfully",
      quizTopic,
      questions,
    });
  } catch (error) {
    console.error("Error retrieving quiz topic:", error);
    res.status(500).json({ message: "Error retrieving quiz topic", error: error.message });
  }
};

import express from "express";
import QuizTopic from "../../models/quiz/quizTopic.js";
import QuizQuestion from "../../models/quiz/quizQuestion.js";
import cloudinary from "../../utils/cloudinaryConfig.js";

// Route to add a quiz topic with an image upload
export const addQuizTopic = async (req, res) => {
  const { title, description,picture } = req.body;
  try {
    let pictureUrl = null;

    

    if (!title || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (picture) {
      // Upload picture to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(picture, {
        folder: "quiz_pictures",
      });
      pictureUrl = result.secure_url;
    }

    const newQuizTopic = await QuizTopic.create({
      title,
      description,
      picture:pictureUrl, 
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
    const { title, description,picture } = req.body;
    let pictureUrl =null
    if (picture) {
      // Upload picture to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(picture, {
        folder: "quiz_pictures",
      });
      pictureUrl = result.secure_url;
    }

    const updatedQuizTopic = await QuizTopic.findByIdAndUpdate(
      quizTopicId,
      { title, description, picture:pictureUrl },
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
    console.log(difficulty)

    // Validate quizTopicId
    if (!quizTopicId) {
      return res.status(400).json({ message: "Quiz Topic ID is required" });
    }

    // Fetch quiz topic and populate questions
    const quizTopic = await QuizTopic.findById(quizTopicId).populate("questions");

    if (!quizTopic) {
      return res.status(404).json({ message: "Quiz Topic not found" });
    }
    

    let questions = quizTopic.questions;

 

    // if (difficulty) {
    //   const validDifficulties = ["Easy", "Medium", "Hard"];
    //   if (!validDifficulties.includes(difficulty)) {
    //     return res.status(400).json({ message: "Invalid difficulty level" });
    //   }

// Filter questions based on difficulty
questions = questions.filter((question) => {
  return question.difficulty === difficulty; // Ensure filter returns a boolean
});
    // console.log(questions)

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

export const getMostClickedQuiz = async (req, res) => {
  try {
    console.log("Received request for most clicked quiz"); // Debug log
    const quizzes = await QuizTopic.find()
      .sort({ clicks: -1 })
      
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found.' });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error retrieving most clicked quiz:', error);
    res.status(500).json({
      message: 'Error retrieving most clicked quiz',
      error: error.message,
    });
  }
};
      

//controller for adding to clicks
export const addClick = async (req, res) => {
  try {
    const { quizTopicId } = req.params;
    const quiz = await QuizTopic.findById(quizTopicId);
    quiz.clicks += 1;
    await quiz.save();
    res.status(200).json({ message: "Click added successfully" });
  }
  catch(error){
    console.error("Error adding click:", error);
    res.status(500).json({ message: "Error adding click", error: error.message });
  }
}







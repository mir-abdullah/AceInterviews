import express from "express";
import User from "../../models/user/user.js";
import InterviewTopic from '../../models/technicalInterview/interviewTopic.js'
import cloudinary from "../../utils/cloudinaryConfig.js";

const router = express.Router();

//route to add a topic
export const addInterviewTopic = async (req, res) => {
  try {
    const { title, description, picture } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let pictureUrl = null;

    if (picture) {
      // Upload picture to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(picture, {
        folder: "interview_pictures",
      });
      pictureUrl = result.secure_url;
    }

    // Create a new InterviewTopic with the provided data
    const newInterviewTopic = await InterviewTopic.create({
      title,
      description,
      picture: pictureUrl, // Use the URL obtained from Cloudinary
    });

    res.status(201).json({ message: "Topic added successfully", newInterviewTopic });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Something went wrong, try again later");
  }
};

//route to get all topics
export const getAllInterviewTopics =async (req, res) => {

  try {
    const allInterviews = await InterviewTopic.find({});
    res.status(200).json({ message: "All Interviews", allInterviews });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Try again later.", error });
  }
};




//route to get a specific interview with questions
export const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await InterviewTopic.findById(interviewId).populate(
      "questions"
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    res.status(200).json({ message: "Interview Topic Retrieved", interview });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

// route to edit an interview topic
export const editInterviewTopic = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { title, description ,picture } = req.body;
    let pictureUrl = null;

    if (picture) {
      // Upload picture to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(picture, {
        folder: "interview_pictures",
      });
      pictureUrl = result.secure_url;
    }
    const updatedInterviewTopic = await InterviewTopic.findByIdAndUpdate(
      interviewId,
      { title, description,picture:pictureUrl },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInterviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    res
      .status(200)
      .json({ message: "Interview Topic Updated", updatedInterviewTopic });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation Error", error });
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

//route to delete an interview topic
export const deleteInterviewTopic = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewTopic = await InterviewTopic.findById(interviewId);

    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    await Question.deleteMany({ _id: { $in: interviewTopic.questions } });

    await InterviewTopic.findByIdAndDelete(interviewId);

    res
      .status(200)
      .json({ message: "Interview Topic and associated questions deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};


//route to get interview questions by difficulty
export const getQuestionsByDifficulty = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { difficulty } = req.body; 

    // Validate interviewId
    if (!interviewId) {
      return res.status(400).json({ message: 'Interview ID is required' });
    }

    const interviewTopic = await InterviewTopic.findById(interviewId).populate('questions'); 

    if (!interviewTopic) {
      return res.status(404).json({ message: 'Interview Topic not found' });
    }

    let questions = interviewTopic.questions;

    console.log('All Questions:', questions); // Log all questions before filtering

    if (difficulty) {
      console.log('Requested difficulty:', difficulty); // Log the requested difficulty

      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({ message: 'Invalid difficulty level' });
      }

      questions = questions.filter(question => question.difficulty === difficulty);
      console.log(`Filtered Questions by difficulty (${difficulty}):`, questions); // Log filtered questions
    }

    res.status(200).json({ 
      message: 'Interview Topic retrieved successfully', 
      interviewTopic,
      questions 
    });
  } catch (error) {
    console.error('Error retrieving interview topic:', error);
    res.status(500).json({ message: 'Error retrieving interview topic', error: error.message });
  }
};


  
  
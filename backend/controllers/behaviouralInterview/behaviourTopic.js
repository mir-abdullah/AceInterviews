import express from "express";
import User from "../../models/user/user.js";
import BehaviourInterviewTopic from "../../models/behaviouralInterview/behaviourTopic.js";
import cloudinary from "../../utils/cloudinaryConfig.js";
import BehaviourQuestion from "../../models/behaviouralInterview/behaviouralQuestion.js";

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

    const newInterviewTopic = await BehaviourInterviewTopic.create({
      title,
      description,
      picture: pictureUrl, //  URL obtained from Cloudinary
    });

    res
      .status(201)
      .json({ message: "Topic added successfully", newInterviewTopic });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong, try again later");
  }
};

//route to get all topics
export const getAllInterviews = async (req, res) => {
  try {
    const allInterviews = await BehaviourInterviewTopic.find();
    res.status(200).json({ message: "All Interviews", allInterviews });
  } catch (error) {
    res
      .status(500)
      .send("Something Went Wrong Try again later" + error.message);
  }
};

//route to get a specific interview with questions
export const getInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await BehaviourInterviewTopic.findById(
      interviewId
    ).populate("questions");

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
    const { title, description, picture } = req.body;
    let pictureUrl = null;

    if (picture) {
      // Upload picture to Cloudinary and get the URL
      const result = await cloudinary.uploader.upload(picture, {
        folder: "interview_pictures",
      });
      pictureUrl = result.secure_url;
    }
    const updatedInterviewTopic =
      await BehaviourInterviewTopic.findByIdAndUpdate(
        interviewId,
        { title, description, picture: pictureUrl },
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

    const interviewTopic = await BehaviourInterviewTopic.findById(interviewId);

    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    await BehaviourQuestion.deleteMany({
      _id: { $in: interviewTopic.questions },
    });

    await BehaviourInterviewTopic.findByIdAndDelete(interviewId);

    res
      .status(200)
      .json({ message: "Interview Topic and associated questions deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
  }
};

//controller to find most clicked interview
export const getMostClickedBehaviouralInterview = async (req, res) => {
  try {
    const interviews = await BehaviourInterviewTopic.find().sort({
      clicks: -1,
    });
    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error retrieving most clicked interview:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving most clicked interview",
        error: error,
      });
  }
};

//controller for adding to clicks
export const addClick = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const topic = await BehaviourInterviewTopic.findById(interviewId);
    topic.clicks += 1;
    await topic.save();
    res.status(200).json({ message: "Click added successfully" });
  } catch (error) {
    console.error("Error adding click:", error);
    res
      .status(500)
      .json({ message: "Error adding click", error: error.message });
  }
};

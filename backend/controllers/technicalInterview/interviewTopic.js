import InterviewTopic from "../../models/technicalInterview/interviewTopic.js";
import cloudinary from "../../utils/cloudinaryConfig.js";


//route to add a topic
export const addInterviewTopic = async (req, res) => {
  try {
    const { title, description, picture } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    let pictureUrl = null;

    if (picture) {
      const result = await cloudinary.uploader.upload(picture, {
        folder: "interview_pictures",
      });
      pictureUrl = result.secure_url;
    }

    // Create a new InterviewTopic
    const newInterviewTopic = await InterviewTopic.create({
      title,
      description,
      picture: pictureUrl,
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
export const getAllInterviewTopics = async (req, res) => {
  try {
    const allInterviews = await InterviewTopic.find({});
    res.status(200).json({ message: "All Interviews", allInterviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Try again later.", error });
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
    const { title, description, picture } = req.body;
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

// Route to get interview questions by difficulty
export const getQuestionsByDifficulty = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { difficulty } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required" });
    }

    // Find interview topic and populate questions
    const interviewTopic = await InterviewTopic.findById(interviewId).populate(
      "questions"
    );
    if (!interviewTopic) {
      return res.status(404).json({ message: "Interview Topic not found" });
    }

    let questions = interviewTopic.questions;
    console.log(" Questions:", questions);

    // Filter by difficulty if it's provided
    if (difficulty) {
      y;

      questions = questions.filter((question) => {
        return question.difficulty === difficulty;
      });
    }

    res.status(200).json({
      message: "Interview Topic retrieved successfully",
      // interviewTopic,
      questions,
    });
  } catch (error) {
    console.error("Error retrieving interview topic:", error);
    res
      .status(500)
      .json({
        message: "Error retrieving interview topic",
        error: error.message,
      });
  }
};

//controller to find most clicked interview
export const getMostClickedInterview = async (req, res) => {
  try {
    const interviews = await InterviewTopic.find().sort({ clicks: -1 });
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
    const topic = await InterviewTopic.findById(interviewId);
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

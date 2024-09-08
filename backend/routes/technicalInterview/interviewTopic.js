import express from "express";
import {
  addInterviewTopic,
  getAllInterviews,
  getInterview,
  editInterviewTopic,
  deleteInterviewTopic,
  getQuestionsByDifficulty,
} from "../../controllers/technicalInterview/interviewTopic.js";

const router = express.Router();

//route to add interview topic
router.post("/add", addInterviewTopic);

//route to get a specific interview
router.get("/:interviewId", getInterview);

//route to get all  interviews
router.get("/interviews", getAllInterviews);

//route to update interview
router.patch("/:interviewId", editInterviewTopic);

//route to delete an interview
router.delete("/:interviewId", deleteInterviewTopic);

//get interview by difficulty
router.get("/:interviewId/difficulty", getQuestionsByDifficulty);

export default router;

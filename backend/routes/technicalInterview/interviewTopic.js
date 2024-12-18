import express from "express";
import {
  addInterviewTopic,
  getAllInterviewTopics,
  getInterview,
  editInterviewTopic,
  deleteInterviewTopic,
  getQuestionsByDifficulty,
  getMostClickedInterview,
  addClick
} from "../../controllers/technicalInterview/interviewTopic.js";

const router = express.Router();

//route to add interview topic
router.post("/add", addInterviewTopic);

//route for counting number of times clicked
router.get("/most-clicked", getMostClickedInterview)

//route to get a specific interview
router.get("/:interviewId", getInterview);

//route to get all  interviews
router.get("/", getAllInterviewTopics);

//route to update interview
router.patch("/:interviewId", editInterviewTopic);

//route to delete an interview
router.delete("/:interviewId", deleteInterviewTopic);

//get interview by difficulty
router.get("/difficulty/:interviewId", getQuestionsByDifficulty);



//route to add click
router.post("/addclick/:interviewId", addClick)
export default router;

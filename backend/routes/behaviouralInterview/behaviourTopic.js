import express from "express";
import {
  addInterviewTopic,
  getAllInterviews,
  getInterview,
  editInterviewTopic,
  deleteInterviewTopic,
  getMostClickedInterview,
  addClick
  
} from "../../controllers/behaviouralInterview/behaviourTopic.js";

const router = express.Router();

//route to add interview topic
router.post("/add", addInterviewTopic);

//route to get a specific interview
router.get("/:interviewId", getInterview);

//route to get all  interviews
router.get("/", getAllInterviews);

//route to update interview
router.patch("/:interviewId", editInterviewTopic);

//route to delete an interview
router.delete("/:interviewId", deleteInterviewTopic);

//route for counting number of times clicked
router.get("/most-clicked", getMostClickedInterview)

//route to add click
router.post("/addclick/:interviewId", addClick)

export default router;

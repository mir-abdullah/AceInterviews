import express from "express";
import {
  addQuizTopic,
  deleteQuizTopic,
  editQuizTopic,
  getAllQuizTopics,
  getQuizTopic,
  getQuestionsByDifficulty,
  getMostClickedQuiz,
  addClick
} from "../../controllers/quiz/quizTopic.js";
import upload from '../../utils/multerConfig.js'
const router = express.Router();

//route to add quiz topic
router.post('/add', addQuizTopic);

//route to get a specific quiz
router.get("/:quizTopicId", getQuizTopic);

//route to get all  interviews
router.get("/", getAllQuizTopics);

//route to update interview
router.patch("/:quizTopicId",  editQuizTopic);

//route to delete an interview
router.delete("/:quizTopicId", deleteQuizTopic);

//get interview by difficulty
router.get("/:quizTopicId/difficulty", getQuestionsByDifficulty);

//route for counting number of times clicked
router.get("/most-clicked",getMostClickedQuiz )

//route to add click
router.post("/addclick/:quizTopicId", addClick)

export default router;

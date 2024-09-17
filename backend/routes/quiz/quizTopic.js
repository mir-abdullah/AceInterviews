import express from "express";
import {
  addQuizTopic,
  deleteQuizTopic,
  editQuizTopic,
  getAllQuizTopics,
  getQuizTopic,
  getQuestionsByDifficulty,
} from "../../controllers/quiz/quizTopic.js";
import upload from '../../utils/multerConfig.js'
const router = express.Router();

//route to add quiz topic
router.post('/add', upload.single('picture'), addQuizTopic);

//route to get a specific quiz
router.get("/:quizId", getQuizTopic);

//route to get all  interviews
router.get("/quizes", getAllQuizTopics);

//route to update interview
router.patch("/:quizId",  editQuizTopic);

//route to delete an interview
router.delete("/:quizId", deleteQuizTopic);

//get interview by difficulty
router.get("/:quizId/difficulty", getQuestionsByDifficulty);

export default router;

import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../../controllers/languageProficiencyTest/responseQuestion.js";

const router = express.Router();

// Create a new question
router.post("/", createQuestion);

// Get all questions
router.get("/", getAllQuestions);

// Get a single question by ID
router.get("/:id", getQuestionById);

// Update a question by ID
router.put("/:id", updateQuestion);

// Delete a question by ID
router.delete("/:id", deleteQuestion);

export default router;

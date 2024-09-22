import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { motion } from "framer-motion";
import { getQuizTopicById } from "../../redux/slices/admin/quizAdmin/quizAdmin";
import { addQuestion, updateQuestion, deleteQuestion } from "../../redux/slices/admin/quizAdmin/quizQuestions";

const QuizQuestions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizId = location.state;

  const dispatch = useDispatch();
  const { currentQuizTopic, loading, error } = useSelector((state) => state.quizAdmin);

  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("");
  const [currentOptions, setCurrentOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [currentId, setCurrentId] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    dispatch(getQuizTopicById(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (currentQuizTopic) {
      setQuestions(currentQuizTopic.questions);
    }
  }, [currentQuizTopic]);

  const handleEdit = (id, text, difficulty, options) => {
    setCurrentQuestion(text);
    setCurrentDifficulty(difficulty);
    setCurrentOptions(options.map(option => ({ ...option }))); // Make a copy of the options
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setCurrentQuestion("");
    setCurrentDifficulty("");
    setCurrentOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setCurrentId(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleSave = () => {
    const questionData = {
      quizId,
      questionText: currentQuestion,
      difficulty: currentDifficulty,
      options: currentOptions,
    };
  
    if (isEditing) {
        console.log(questionData)
      dispatch(updateQuestion({ questionId: currentId, ...questionData }))
        .then(() => dispatch(getQuizTopicById(quizId)));
    } else {
      dispatch(addQuestion(questionData))
        .then(() => dispatch(getQuizTopicById(quizId)));
    }
    setOpenModal(false);
  };
  

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentOptions];
    newOptions[index][field] = value;
    setCurrentOptions(newOptions);
  };

  const handleCorrectOptionChange = (index) => {
    const newOptions = currentOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index, // Only one option can be correct
    }));
    setCurrentOptions(newOptions);
  };

  const handleDelete = (id) => {
    setQuestionToDelete(id);
    setOpenConfirmDelete(true);
  };

  const confirmDelete = () => {
    dispatch(deleteQuestion({ quizId, questionId: questionToDelete }))
      .then(() => dispatch(getQuizTopicById(quizId)));
    setOpenConfirmDelete(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleBack = () => {
    navigate('/admin/quizes');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {currentQuizTopic ? currentQuizTopic.title : "Loading..."}
      </h2>

      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Back to Main Quiz Page
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus />
          Add Question
        </motion.button>
      </div>

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {questions.map((question) => (
          <motion.div
            key={question._id}
            className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: question._id * 0.1 }}
          >
            <div>
              <span className="text-lg font-medium text-gray-700">{question.questionText}</span>
              <p className="text-sm text-gray-800">Difficulty: {question.difficulty}</p>
              <ul className="text-sm text-gray-600">
                {question.options.map((option, index) => (
                  <li key={index} className={option.isCorrect ? "text-green-500" : ""}>
                    {index + 1}. {option.text} {option.isCorrect ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEdit(question._id, question.questionText, question.difficulty, question.options)}
                className="text-indigo-600 hover:text-indigo-800 p-4"
              >
                <FaEdit />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDelete(question._id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Question Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
  <Box
    className="bg-white p-4 rounded-lg w-full max-w-sm mx-auto my-20 shadow-lg mt-10"
    component={motion.div}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    sx={{ maxWidth: '70%', margin: 'auto' }} // Set max-width to 80% of screen for responsiveness
  >
    <h3 className="text-xl font-bold mb-3">{isEditing ? "Edit Question" : "Add Question"}</h3>

    <div className="space-y-2"> {/* Adds space between all elements */}
      {/* Question Input */}
      <TextField
        fullWidth
        label="Question"
        variant="outlined"
        value={currentQuestion}
        onChange={(e) => setCurrentQuestion(e.target.value)}
        multiline
        rows={2} // Reduced the rows to decrease height
        className="mb-2"
      />

      {/* Difficulty Selection */}
      <FormControl fullWidth className="mb-2">
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={currentDifficulty}
          onChange={(e) => setCurrentDifficulty(e.target.value)}
          label="Difficulty"
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>

      {/* Options */}
      {currentOptions.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <TextField
            fullWidth
            label={`Option ${index + 1}`}
            variant="outlined"
            value={option.text}
            onChange={(e) => handleOptionChange(index, "text", e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={option.isCorrect}
                onChange={() => handleCorrectOptionChange(index)}
              />
            }
            label="Correct"
          />
        </div>
      ))}
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 p-2">
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
        Cancel
      </Button>
    </div>
  </Box>
</Modal>




      {/* Confirmation Modal for Deletion */}
      <Modal open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <Box
          className="bg-white p-6 rounded-lg max-w-lg mx-auto my-20 shadow-lg"
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this question?</p>
          <div className="flex justify-end gap-4 p-4">
            <Button variant="contained" color="secondary" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outlined" onClick={handleCloseConfirmDelete}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default QuizQuestions;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { motion } from "framer-motion";
import { fetchMcqQuestions, addMcqQuestion, updateMcqQuestion, deleteMcqQuestion } from "../../redux/slices/languageProficiencyTest/mcqQuestion.slice";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const McqQuestions = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { questions, loading, error } = useSelector((state) => state.mcq);

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(fetchMcqQuestions());
  }, [dispatch]);

  const handleEdit = (id, text, difficulty, options) => {
    setCurrentQuestion(text);
    setCurrentOptions(options.map(option => ({ ...option })));
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  //back button
  const handleBack = () => {
    navigate('/admin/language-test');
  };

  const handleAdd = () => {
    setCurrentQuestion("");
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
      questionText: currentQuestion,
      options: currentOptions,
    };

    if (isEditing) {
      dispatch(updateMcqQuestion({ id: currentId, updatedQuestion: questionData })).then(() =>
        dispatch(fetchMcqQuestions())
      );
    } else {
      dispatch(addMcqQuestion(questionData)).then(() => dispatch(fetchMcqQuestions()));
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
      isCorrect: i === index,
    }));
    setCurrentOptions(newOptions);
  };

  const handleDelete = (id) => {
    dispatch(deleteMcqQuestion(id)).then(() => dispatch(fetchMcqQuestions()));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">MCQ Questions</h2>

      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Back to Main Language Proficiency Test Page
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
          >
            <div>
              <span className="text-lg font-medium">{question.questionText}</span>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index} className={option.isCorrect ? "text-green-500" : ""}>
                    {index + 1}. {option.text} {option.isCorrect ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleEdit(question._id, question.questionText, question.difficulty, question.options)} className="text-blue-600">
                <FaEdit/>
              </button>
              <button onClick={() => handleDelete(question._id)} className="text-red-600">
                <FaTrash/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="p-4 bg-white rounded-md shadow-md max-w-md mx-auto mt-20">
          <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit Question" : "Add Question"}</h3>

          <TextField
            fullWidth
            label="Question"
            variant="outlined"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            multiline
            rows={3}
            className="mb-4"
          />

        

          {currentOptions.map((option, index) => (
            <div key={index} className="flex items-center mb-4">
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                variant="outlined"
                value={option.text}
                onChange={(e) => handleOptionChange(index, "text", e.target.value)}
              />
              <Checkbox checked={option.isCorrect} onChange={() => handleCorrectOptionChange(index)} />
            </div>
          ))}

          <div className="flex justify-end gap-3">
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default McqQuestions;

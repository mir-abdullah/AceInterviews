import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Modal, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { fetchMcqQuestions, addMcqQuestion, updateMcqQuestion, deleteMcqQuestion } from "../../redux/slices/languageProficiencyTest/mcqQuestion.slice"

const LanguageTestAdmin = () => {
  const dispatch = useDispatch();
  const { questions, loading, error } = useSelector((state) => state.mcq);

  const [selectedTab, setSelectedTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMcqQuestions());
  }, [dispatch, selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    // Fetch corresponding stage questions based on `newValue`
    // Assuming slice actions for stage2 and stage3 exist
    // dispatch(fetchStage2Questions()) or dispatch(fetchStage3Questions());
  };

  const handleAdd = () => {
    setCurrentQuestion("");
    setCurrentDifficulty("");
    setCurrentId(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleEdit = (id, text, difficulty) => {
    setCurrentQuestion(text);
    setCurrentDifficulty(difficulty);
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (isEditing) {
      dispatch(updateMcqQuestion({ id: currentId, updatedQuestion: { text: currentQuestion, difficulty: currentDifficulty } }));
    } else {
      dispatch(addMcqQuestion({ text: currentQuestion, difficulty: currentDifficulty }));
    }
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    setQuestionToDelete(id);
    dispatch(deleteMcqQuestion(id));
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Language Test Admin</h2>

      {/* Tabs for Stages */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Stage 1 Questions" />
        <Tab label="Stage 2 Questions" />
        <Tab label="Stage 3 Questions" />
      </Tabs>

      <div className="flex justify-between items-center mb-6 mt-4">
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
            transition={{ delay: 0.1 }}
          >
            <div>
              <span className="text-lg font-medium text-gray-700">{question.questionText}</span>
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
                onClick={() => handleEdit(question._id, question.questionText, )}
                className="text-indigo-600 hover:text-indigo-800"
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
        <Box className="bg-white p-6 rounded-lg max-w-lg mx-auto my-20 shadow-lg">
          <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit Question" : "Add Question"}</h3>
          <TextField
            fullWidth
            label="Question"
            variant="outlined"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            multiline
            rows={3}
            className="mb-3"
          />
          <FormControl fullWidth className="mb-4">
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
          <div className="flex justify-end gap-4 p-4">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default LanguageTestAdmin;

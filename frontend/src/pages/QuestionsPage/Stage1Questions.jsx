import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  fetchMcqQuestions,
  addMcqQuestion,
  updateMcqQuestion,
  deleteMcqQuestion,
} from "../../redux/slices/languageProficiencyTest/mcqQuestion.slice";

const Stage1Questions = () => {
  const dispatch = useDispatch();
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

  const handleAdd = () => {
    setCurrentQuestion("");
    setCurrentOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleEdit = (id, text, options) => {
    setCurrentQuestion(text);
    setCurrentOptions(options);
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (!currentQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (currentOptions.some((option) => !option.text.trim())) {
      alert("All options must have text.");
      return;
    }
    if (!currentOptions.some((option) => option.isCorrect)) {
      alert("Please mark at least one option as correct.");
      return;
    }

    if (isEditing) {
      dispatch(
        updateMcqQuestion({
          id: currentId,
          updatedQuestion: {
            text: currentQuestion,
            options: currentOptions,
          },
        })
      );
    } else {
      dispatch(
        addMcqQuestion({
          text: currentQuestion,
          options: currentOptions,
        })
      );
    }
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dispatch(deleteMcqQuestion(id));
    }
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index][key] = value;
    setCurrentOptions(updatedOptions);
  };

  const handleCorrectOptionChange = (index) => {
    const updatedOptions = currentOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setCurrentOptions(updatedOptions);
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Stage 1 Questions
      </h2>

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
        {questions?.length > 0 ? (
          questions.map((question) => (
            <motion.div
              key={question._id}
              className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <span className="text-lg font-medium text-gray-700">
                  {question.questionText}
                </span>
                <div>
                  {question.options.map((option, index) => (
                    <p
                      key={index}
                      className={`text-sm ${
                        option.isCorrect ? "text-green-600" : "text-gray-800"
                      }`}
                    >
                      {option.text}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() =>
                    handleEdit(question._id, question.text, question.options)
                  }
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
          ))
        ) : (
          <p>No questions available. Please add a question.</p>
        )}
      </div>

      {/* Add/Edit Question Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: "90%",
            maxWidth: "500px",
          }}
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="text-xl font-bold mb-3">
            {isEditing ? "Edit Question" : "Add Question"}
          </h3>

          <div className="space-y-2">
            <TextField
              fullWidth
              label="Question"
              variant="outlined"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              multiline
              rows={2}
            />

            {currentOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                />
                <Button
                  variant="outlined"
                  color={option.isCorrect ? "primary" : "default"}
                  onClick={() => handleCorrectOptionChange(index)}
                >
                  {option.isCorrect ? "Correct" : "Mark Correct"}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 p-2">
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Stage1Questions;

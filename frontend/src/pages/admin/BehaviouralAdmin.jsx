import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, TextField, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

// Initial questions
const initialQuestions = [
  {
    id: 1,
    text: "Tell me about a time you had to work under pressure to meet a tight deadline in a previous kitchen environment.",
  },
  {
    id: 2,
    text: "Describe a situation where you had to deal with a difficult coworker.",
  },
  {
    id: 3,
    text: "Give me an example of a time you demonstrated leadership skills.",
  },
  {
    id: 4,
    text: "Tell me about a time you had to make a difficult decision at work.",
  },
  {
    id: 5,
    text: "Describe a scenario where you had to adapt to significant changes at work.",
  },
];

const BehavioralAdmin = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentId, setCurrentId] = useState(null);

  // Open modal for editing
  const handleEdit = (id, text) => {
    setCurrentQuestion(text);
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  // Open modal for adding
  const handleAdd = () => {
    setCurrentQuestion("");
    setIsEditing(false);
    setOpenModal(true);
  };

  // Save question (either editing or adding)
  const handleSave = () => {
    if (isEditing) {
      // Update existing question
      setQuestions(
        questions.map((q) =>
          q.id === currentId ? { ...q, text: currentQuestion } : q
        )
      );
    } else {
      // Add new question
      const newQuestion = { id: questions.length + 1, text: currentQuestion };
      setQuestions([...questions, newQuestion]);
    }
    setOpenModal(false);
  };

  // Delete question
  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Modal close
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Add Question Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Behavioral Interview Questions
        </h2>
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

      {/* List of Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <motion.div
            key={question.id}
            className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: question.id * 0.1 }}
          >
            <span className="text-lg font-medium text-gray-700">
              {question.text}
            </span>
            <div className="flex gap-4">
              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEdit(question.id, question.text)}
                className="text-indigo-600 hover:text-indigo-800 p-4"
              >
                <FaEdit />
              </motion.button>
              {/* Delete Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleDelete(question.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Adding/Editing Questions */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg max-w-lg mx-auto my-20 shadow-lg"
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h3 className="text-xl font-bold mb-4">
            {isEditing ? "Edit Question" : "Add Question"}
          </h3>
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
          <div className="flex justify-end gap-4 p-4">
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

export default BehavioralAdmin;

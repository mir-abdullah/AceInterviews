import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux"; 
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, TextField, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { fetchInterviewWithQuestions } from '../../redux/slices/admin/behaviouralAdmin/behaviouralAdmin.slice';
import { addQuestion, updateQuestion, deleteQuestion } from '../../redux/slices/admin/behaviouralAdmin/behaviourQuestion';

const QuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use history hook for navigation
  const interviewId = location.state;

  const dispatch = useDispatch();
  const { selectedInterview, loading, error } = useSelector((state) => state.interviews);
  
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchInterviewWithQuestions(interviewId));
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (selectedInterview) {
      setQuestions(selectedInterview.questions);
    }
  }, [selectedInterview]);

  const handleEdit = (id, text) => {
    setCurrentQuestion(text);
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setCurrentQuestion("");
    setCurrentId(null);
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleSave = () => {
    if (isEditing) {
      dispatch(updateQuestion({ interviewId, questionId: currentId, questionData: { text: currentQuestion } }))
        .then(() => dispatch(fetchInterviewWithQuestions(interviewId))); // Fetch updated questions
    } else {
      dispatch(addQuestion({ interviewId, questionData: { text: currentQuestion } }))
        .then(() => dispatch(fetchInterviewWithQuestions(interviewId))); // Fetch updated questions
    }
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    setQuestionToDelete(id);
    setOpenConfirmDelete(true);
  };

  const confirmDelete = () => {
    dispatch(deleteQuestion({ interviewId, questionId: questionToDelete }))
      .then(() => dispatch(fetchInterviewWithQuestions(interviewId))); // Fetch updated questions
    setOpenConfirmDelete(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  // Function to go back to the main technical page
  const handleBack = () => {
    navigate('/admin/behavioraladmin'); // Adjust the path to your main technical page route
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {selectedInterview ? selectedInterview.title : "Loading..."}
      </h2>

      <div className="flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack} // Back button functionality
          className="bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Back to Main Technical Page
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
            <span className="text-lg font-medium text-gray-700">
              {question.text}
            </span>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleEdit(question._id, question.text)}
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
              Confirm
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseConfirmDelete}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default QuestionsPage;

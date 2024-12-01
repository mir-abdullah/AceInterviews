import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, TextField, Button, Box, Checkbox } from "@mui/material";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { 
  createResponseQuestion, 
  getAllResponseQuestions, 
  updateResponseQuestion, 
  deleteResponseQuestion 
} from "../../redux/slices/languageProficiencyTest/responseQuestion.slice";
import { useNavigate } from "react-router-dom";

const ResponseQuestions = () => {
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const { responseQuestions, loading, error } = useSelector((state) => state.responseQuestions);

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null); // For audio file
  const [currentOptions, setCurrentOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    dispatch(getAllResponseQuestions());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentAudio(null);
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
   //back button
   const handleBack = () => {
    navigate('/admin/language-test');
  };


  const handleEdit = (id, audio, options) => {
    setCurrentAudio(audio);
    setCurrentOptions(options.map(option => ({ ...option })));
    setCurrentId(id);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleSave = () => {
    const questionData = {
      audio: currentAudio,
      options: currentOptions,
    };

    if (isEditing) {
      dispatch(updateResponseQuestion({ id: currentId, questionData })).then(() =>
        dispatch(getAllResponseQuestions())
      );
    } else {
      dispatch(createResponseQuestion(questionData)).then(() =>
        dispatch(getAllResponseQuestions())
      );
    }
    setOpenModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteResponseQuestion(id)).then(() => dispatch(getAllResponseQuestions()));
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

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    setCurrentAudio(file);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Response Questions</h2>

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
        {responseQuestions.map((question) => (
          <motion.div
            key={question._id}
            className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <audio controls src={question.questionAudio} className="mb-4"></audio>
              <ul>
                {question.options.map((option, index) => (
                  <li key={index} className={option.isCorrect ? "text-green-500" : ""}>
                    {index + 1}. {option.text} {option.isCorrect ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  handleEdit(question._id, question.audio, question.options)
                }
                className="text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(question._id)}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="p-4 bg-white rounded-md shadow-md max-w-md mx-auto mt-20">
          <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit Question" : "Add Question"}</h3>

          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
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

export default ResponseQuestions;

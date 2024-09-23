import React, { useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaCode,
  FaMobileAlt,
  FaPencilRuler,
  FaDatabase,
  FaPlus,
} from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

// Icon options for selection
const iconOptions = [
  { value: <FaCode />, label: "Web Development" },
  { value: <FaMobileAlt />, label: "Mobile Development" },
  { value: <FaPencilRuler />, label: "UI/UX Design" },
  { value: <FaDatabase />, label: "Database Engineering" },
];

const AddTechScenario = ({ onSaveInterview }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [error, setError] = useState("");

  // Function to add a new question
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  // Function to delete a question
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Function to handle interview saving
  const handleSaveInterview = () => {
    if (questions.length < 5) {
      setError("You need to add at least 5 questions.");
      return;
    }

    const newScenario = {
      title,
      description,
      icon,
      questions,
    };

    // Here you can handle the logic of saving the interview scenario
    onSaveInterview(newScenario); // Send data to parent component or backend

    // Reset the form after saving
    setTitle("");
    setDescription("");
    setIcon("");
    setQuestions([]);
    setError("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <Typography
        variant="h4"
        className="text-center font-bold mb-6 text-gray-700"
      >
        Add New Technical Interview Scenario
      </Typography>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title Field */}
        <TextField
          label="Scenario Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />

        {/* Description Field */}
        <TextField
          label="Scenario Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4"
        />

        {/* Icon Selection */}
        <FormControl fullWidth className="mb-4">
          <InputLabel>Select Icon</InputLabel>
          <Select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            label="Select Icon"
          >
            {iconOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add Questions */}
        <Typography variant="h6" className="font-bold mb-4 text-gray-700">
          Add Questions (At least 5)
        </Typography>

        {/* Show Error if less than 5 questions */}
        {error && <Typography color="error">{error}</Typography>}

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography>{question}</Typography>
              <Button
                color="error"
                onClick={() => handleDeleteQuestion(index)}
                startIcon={<MdDeleteOutline />}
              >
                Delete
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Add New Question Input */}
        <div className="flex items-center mb-6">
          <TextField
            label="New Question"
            variant="outlined"
            fullWidth
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            className="ml-4"
            onClick={handleAddQuestion}
            startIcon={<FaPlus />}
          >
            Add Question
          </Button>
        </div>

        {/* Save Interview Button */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleSaveInterview}
          className="mt-4"
        >
          Save Interview Scenario
        </Button>
      </Box>
    </div>
  );
};

export default AddTechScenario;

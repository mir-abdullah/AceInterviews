import React, { useState } from "react";
import { FaCode, FaMobileAlt, FaPencilRuler, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
} from "@mui/material";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md"; // Using Material UI delete icon

// Initial questions for the scenarios
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
const fields = [
  {
    title: "Web Development",
    description:
      "Take an interview to test your skills in modern web technologies and frameworks.",
    icon: <FaCode size={40} color="#4CAF4F" />,
  },
  {
    title: "Mobile Development",
    description:
      "Assess your knowledge in developing mobile applications for iOS and Android.",
    icon: <FaMobileAlt size={40} color="#FF9800" />,
  },
  {
    title: "UI/UX Design",
    description:
      "Evaluate your design skills in user interfaces and user experiences.",
    icon: <FaPencilRuler size={40} color="#2196F3" />,
  },
  {
    title: "Database Engineering",
    description:
      "Test your ability to design, implement, and manage databases.",
    icon: <FaDatabase size={40} color="#9C27B0" />,
  },
];

const TechnicalAdmin = () => {
  const navigate = useNavigate();

  const [openEditInterviewModal, setOpenEditInterviewModal] = useState(false);
  const [openEditScenarioModal, setOpenEditScenarioModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [questions, setQuestions] = useState(initialQuestions);

  //add another question to existing interview scenario
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  // Update a question inline
  const handleQuestionChange = (index, newText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = newText;
    setQuestions(updatedQuestions);
  };

  // Delete a question
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOpenEditInterview = (interview) => {
    setSelectedInterview(interview);
    setOpenEditInterviewModal(true);
  };

  const handleOpenEditScenario = (interview) => {
    setSelectedInterview(interview);
    setOpenEditScenarioModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditInterviewModal(false);
    setOpenEditScenarioModal(false);
  };

  //Function to Open the Add New Question Modal
  const handleOpenAddQuestionModal = () => {
    setNewQuestionText("");
    setOpenAddQuestionModal(true);
  };

  const handleSaveNewQuestion = () => {
    if (newQuestionText.trim()) {
      const newQuestionObj = {
        id: questions.length + 1, // Generate a new unique ID
        text: newQuestionText,
      };
      setQuestions([...questions, newQuestionObj]); // Add the new question
      setOpenAddQuestionModal(false); // Close the modal after saving
    }
  };

  // Render the interview cards
  const renderInterviewCards = () => {
    return fields.map((field, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="hover:scale-105 transition duration-300 w-full md:w-1/3 p-4"
      >
        <div className="shadow-lg rounded-lg p-6 bg-white">
          <div className="flex items-center mb-4">
            <div className="mr-4">{field.icon}</div>
            <h2 className="text-xl font-semibold">{field.title}</h2>
          </div>
          <p className="text-gray-600 mb-4">{field.description}</p>
          <Stack direction="row" spacing={2} className="mt-4">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiFillEdit />}
              onClick={() => handleOpenEditInterview(field)}
            >
              Edit Interview
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FaCode />}
              onClick={() => handleOpenEditScenario(field)}
            >
              Edit Scenario
            </Button>
          </Stack>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="text-center font-bold mb-6">
        Manage Technical Interviews
      </Typography>
      <div className="flex flex-wrap justify-center">
        {renderInterviewCards()}
      </div>
      {/* Modal for editing interview details */}
      <Modal open={openEditInterviewModal} onClose={handleCloseModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="m-6 mx-auto w-full max-w-lg gap-4 "
          style={{ outline: "none" }}
        >
          <Card className="shadow-lg ">
            <CardContent className="p-10 bg-gray-100 rounded-lg gap-4">
              <Typography
                variant="h5"
                className="mb-6 text-center font-semibold text-gray-800"
              >
                Edit {selectedInterview?.title}
              </Typography>

              <TextField
                label="Interview Title"
                fullWidth
                defaultValue={selectedInterview?.title}
                className="mb-12 "
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    fontSize: "1rem",
                    fontWeight: "500",
                  },
                }}
              />

              <TextField
                label="Description"
                fullWidth
                defaultValue={selectedInterview?.description}
                multiline
                rows={4}
                className="mb-12"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    fontSize: "1rem",
                    fontWeight: "500",
                  },
                }}
              />

              <FormControl fullWidth className="mb-12 ">
                <InputLabel shrink>Icon</InputLabel>
                <Select
                  value={selectedInterview?.icon}
                  label="Icon"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    "& .MuiSelect-icon": {
                      color: "#1976d2",
                    },
                  }}
                >
                  <MenuItem value={<FaCode />}>Web Development</MenuItem>
                  <MenuItem value={<FaMobileAlt />}>
                    Mobile Development
                  </MenuItem>
                  <MenuItem value={<FaPencilRuler />}>UI/UX Design</MenuItem>
                  <MenuItem value={<FaDatabase />}>
                    Database Engineering
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCloseModal}
                className="py-3 text-lg font-semibold"
                sx={{
                  backgroundColor: "#1976d2",
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Modal>
      ; ; ;{/* Modal for editing interview scenario */}
      <Modal open={openEditScenarioModal} onClose={handleCloseModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl p-8 mx-auto my-12 w-full max-w-3xl"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <h3 className="text-xl font-bold mb-6 text-gray-700">
            Edit {selectedInterview?.title} Questions
          </h3>

          <div
            className="space-y-4"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {questions.map((question, index) => (
              <motion.div
                key={question.id}
                className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: question.id * 0.1 }}
              >
                <TextField
                  fullWidth
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  variant="outlined"
                  className="mr-6 bg-white rounded-md"
                />
                <Button
                  className="gap-4 hover:bg-red-50"
                  color="error"
                  startIcon={<MdDeleteOutline size={25} />}
                  onClick={() => handleDeleteQuestion(index)}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    minWidth: "unset",
                    "&:hover": {
                      backgroundColor: "#ffe6e6",
                    },
                  }}
                />
              </motion.div>
            ))}
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddQuestionModal}
            className="mt-6"
          >
            Add New Question
          </Button>
        </motion.div>
      </Modal>
      {/* //New Modal for Adding the New Question: */}
      <Modal
        open={openAddQuestionModal}
        onClose={() => setOpenAddQuestionModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-xl p-8 mx-auto my-12 w-full max-w-md"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-700">
            Add New Question
          </h3>
          <TextField
            fullWidth
            label="New Question"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
            className="mb-6"
          />
          <div className="flex justify-end gap-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveNewQuestion}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenAddQuestionModal(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </Modal>
      {/* Button to add new interview scenario */}
      <div className="text-center mt-6">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={() => navigate("/admin/techscenario")}
        >
          Add New Technical Interview Scenario
        </Button>
      </div>
    </div>
  );
};

export default TechnicalAdmin;

{
  /* Button to add new interview scenario */
}
//  <div className="text-center mt-6">
//  <Button variant="contained" color="success" size="large">
//    Add New Technical Interview Scenario
//  </Button>
// </div>

// const fields = [
//     {
//       title: "Web Development",
//       description:
//         "Take an interview to test your skills in modern web technologies and frameworks.",
//       icon: <FaCode size={40} color="#4CAF4F" />,
//     },
//     {
//       title: "Mobile Development",
//       description:
//         "Assess your knowledge in developing mobile applications for iOS and Android.",
//       icon: <FaMobileAlt size={40} color="#FF9800" />,
//     },
//     {
//       title: "UI/UX Design",
//       description:
//         "Evaluate your design skills in user interfaces and user experiences.",
//       icon: <FaPencilRuler size={40} color="#2196F3" />,
//     },
//     {
//       title: "Database Engineering",
//       description:
//         "Test your ability to design, implement, and manage databases.",
//       icon: <FaDatabase size={40} color="#9C27B0" />,
//     },
//   ];

//

{
  /* <Stack direction="row" spacing={2} className="mt-4">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AiFillEdit />}
                onClick={() => handleOpenEditInterview(field)}
              >
                Edit Interview
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FaCode />}
                onClick={() => handleOpenEditScenario(field)}
              >
                Edit Scenario
              </Button>
            </Stack> */
}

{
  /* Modal for editing interview details */
}
//   <Modal open={openEditInterviewModal} onClose={handleCloseModal}>
//   <div className="bg-white rounded-lg shadow-lg p-8 m-6 mx-auto w-full max-w-md">
//     <Typography variant="h6" className="mb-4">
//       Edit {selectedInterview?.title}
//     </Typography>
//     <TextField
//       label="Interview Title"
//       fullWidth
//       defaultValue={selectedInterview?.title}
//       className="mb-4"
//     />
//     <TextField
//       label="Description"
//       fullWidth
//       defaultValue={selectedInterview?.description}
//       multiline
//       rows={3}
//       className="mb-4"
//     />
//     <FormControl fullWidth className="mb-4">
//       <InputLabel>Icon</InputLabel>
//       <Select defaultValue={selectedInterview?.icon} label="Icon">
//         <MenuItem value={<FaCode />}>Web Development</MenuItem>
//         <MenuItem value={<FaMobileAlt />}>Mobile Development</MenuItem>
//         <MenuItem value={<FaPencilRuler />}>UI/UX Design</MenuItem>
//         <MenuItem value={<FaDatabase />}>Database Engineering</MenuItem>
//       </Select>
//     </FormControl>
//     <Button
//       variant="contained"
//       color="primary"
//       fullWidth
//       onClick={handleCloseModal}
//     >
//       Save Changes
//     </Button>
//   </div>
// </Modal>

//  const renderInterviewCards = () => {
//     return fields.map((field, index) => (
//         <motion.div
//           key={index}
//           initial={{ opacity: 0, translateY: 20 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//           className="hover:scale-105 transition duration-300 w-full md:w-1/3 p-4"
//         >
//           <Card className="shadow-lg rounded-lg p-6">
//             <CardContent>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Avatar className="bg-gray-100">{field.icon}</Avatar>
//                 <Typography variant="h6" className="font-bold">
//                   {field.title}
//                 </Typography>
//               </Stack>
//               <Typography className="mt-2 text-gray-600">
//                 {field.description}
//               </Typography>
//               <Stack direction="row" spacing={2} className="mt-4">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   startIcon={<AiFillEdit />}
//                   onClick={() => handleOpenEditInterview(field)}
//                 >
//                   Edit Interview
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   startIcon={<FaCode />}
//                   onClick={() => handleOpenEditScenario(field)}
//                 >
//                   Edit Scenario
//                 </Button>
//               </Stack>
//             </CardContent>
//           </Card>
//         </motion.div>
//       ));
//     };

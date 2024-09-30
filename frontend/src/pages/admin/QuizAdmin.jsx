import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  Modal,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllQuizTopics,
  addQuizTopic,
  deleteQuizTopic,
  editQuizTopic,
  getQuestionsByDifficulty,
} from "../../redux/slices/admin/quizAdmin/quizAdmin";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const QuizAdmin = () => {
  const dispatch = useDispatch();
  const { quizTopics, loading, error } = useSelector((state) => state.quizAdmin);
  const [openModal, setOpenModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState({ title: "", description: "", picture: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllQuizTopics());
  }, [dispatch]);

  // Open modal for adding a new quiz topic
  const handleAdd = () => {
    setCurrentQuiz({ title: "", description: "", picture: "" });
    setImagePreview(null);
    setOpenModal(true);
  };

  // Open modal for editing an existing quiz topic
  const handleEdit = (quiz) => {
    setCurrentQuiz(quiz); 
    setImagePreview(quiz.picture); 
    setOpenModal(true);
  };
  

  // Save quiz topic (dispatch add/update action)
  const handleSave = () => {
    if (currentQuiz._id) {
      const quizData = {
        ...currentQuiz,
        picture: currentQuiz.picture || imagePreview, 
      };
      dispatch(editQuizTopic({ quizTopicId: currentQuiz._id, updatedData: quizData }));
    } else {
      dispatch(addQuizTopic(currentQuiz));
    }
    setOpenModal(false);
  };
  

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Show the new image preview
        setCurrentQuiz({ ...currentQuiz, picture: reader.result }); // Update the picture in the state
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleOpenDeleteDialog = (id) => {
    setSelectedQuizId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteQuizTopic(selectedQuizId));
    setOpenDeleteDialog(false);
  };

  const handleFetchQuestions = (id) => {
    navigate(`/admin/quiz/questions`, { state: id });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        borderRadius: "20px",
      }}
      className="bg-white"
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#263238", mb: 4 }}
      >
        Manage Quiz Topics
      </Typography>

      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Quiz Topic
        </motion.button>
      </div>

      <Grid container spacing={3} justifyContent="center">
        {quizTopics && quizTopics.length > 0 ? (
          quizTopics.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz._id}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
                    borderRadius: "15px",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {quiz.picture && (
                    <CardMedia
                      component="img"
                      height="60"
                      image={quiz.picture}
                      alt={`${quiz.title} image`}
                      sx={{
                        objectFit: "contain",
                        margin: "10px auto",
                        width: "60%",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4CAF4F", mb: 0.5 }}>
                      {quiz.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quiz.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#4CAF4F",
                        color: "#ffffff",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        "&:hover": { backgroundColor: "#388E3C" },
                      }}
                      onClick={() => handleEdit(quiz)}
                    >
                      Edit Quiz
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#4CAF4F",
                        color: "#ffffff",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        "&:hover": { backgroundColor: "#388E3C" },
                      }}
                      onClick={() => handleFetchQuestions(quiz._id)}
                    >
                      View Questions
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: "#FF5252",
                        color: "#ffffff",
                        fontWeight: "bold",
                        borderRadius: "20px",
                        "&:hover": { backgroundColor: "#E53935" },
                      }}
                      onClick={() => handleOpenDeleteDialog(quiz._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Typography>No quiz topics found.</Typography>
        )}
      </Grid>

      {/* Modal for Adding/Editing Quiz Topics */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            borderRadius: "15px",
            boxShadow: 24,
            bgcolor: "background.paper",
            maxWidth: "800px",
            maxHeight: "80vh",
            margin: "auto",
            mt: "10%",
            display: "flex",
            alignItems: "flex-start",
            overflowY: "auto",
          }}
        >
          {/* Left Side: Image Upload */}
          <Box sx={{ flex: "1", mr: 2 }}>
            <Typography
              variant="h5"
              align="center"
              sx={{ mb: 2, fontWeight: "bold", color: "#4CAF4F" }}
            >
              {currentQuiz._id ? "Edit Quiz" : "Add Quiz"}
            </Typography>
            <Card
              sx={{
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                border: "1px dashed #ccc",
              }}
            >
              {imagePreview ? (
                <CardMedia
                  component="img"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">No image uploaded</Typography>
              )}
            </Card>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "block",
                margin: "20px auto 0",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Box>

          {/* Right Side: Title and Description */}
          <Box
            sx={{ flex: "2", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            className="mt-12"
          >
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={currentQuiz.title}
              onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
              className="mb-4"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={currentQuiz.description}
              onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
              multiline
              rows={4}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />

            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: "#4CAF4F", "&:hover": { backgroundColor: "#388E3C" } }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#4CAF4F", borderColor: "#4CAF4F" }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-confirmation-dialog"
        aria-describedby="confirm-delete-quiz"
      >
        <DialogTitle id="delete-confirmation-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-quiz">
            Are you sure you want to delete this quiz topic? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ color: "#999" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: "#FF5252",
              color: "#fff",
              "&:hover": { backgroundColor: "#E53935" },
            }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizAdmin;

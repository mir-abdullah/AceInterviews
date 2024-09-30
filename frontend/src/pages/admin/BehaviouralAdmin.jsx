import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, CardContent, Typography, Grid, Button, Modal, TextField ,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInterviews, addInterviewTopic ,deleteInterviewTopic,editInterviewTopic} from "../../redux/slices/admin/behaviouralAdmin/behaviouralAdmin.slice";
import { FaPlus,FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BehavioralAdmin = () => {
  const dispatch = useDispatch();
  const { interviews, selectedInterview,loading, error } = useSelector((state) => state.interviews);
  const [openModal, setOpenModal] = useState(false);
  const [currentInterview, setCurrentInterview] = useState({ title: "", description: "", picture: "" });
  const [imagePreview, setImagePreview] = useState(null); 
  const [open, setOpen] = useState(false); 
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const navigate =useNavigate()

  useEffect(() => {
    dispatch(fetchAllInterviews());
  }, [dispatch]);

  //fetchInterview
  const handleFetchInterview = async (id) => {
    navigate('/admin/behaviour/questions',{state:id});

  
  }

  // Open modal for adding a new interview
  const handleAdd = () => {
    setCurrentInterview({ title: "", description: "", picture: "" });
    setImagePreview(null); // Reset image preview
    setOpenModal(true);
  };

  // Open modal for editing an existing interview
  const handleEdit = (interview) => {
    setCurrentInterview(interview);
    setImagePreview(interview.picture); 
    setOpenModal(true);
  };

  // Save interview (dispatch add/update action)
  const handleSave = () => {
    if (currentInterview._id) {
        dispatch(editInterviewTopic({interviewId:currentInterview._id ,interviewData:currentInterview}));
      // Logic to update the existing interview could go here
      // For now, just closing the modal
      setOpenModal(false);
    } else {
      // Dispatch addInterviewTopic when creating a new interview
      dispatch(addInterviewTopic(currentInterview));
      setOpenModal(false); 
    }
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
        setImagePreview(reader.result); // Set image preview
        setCurrentInterview({ ...currentInterview, picture: reader.result }); // Update current interview with the image
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOpenDeleteModal = (id) => {
    setSelectedInterviewId(id);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Function to confirm the delete action
  const handleDeleteConfirm = () => {
    dispatch(deleteInterviewTopic(selectedInterviewId)); 
    setOpen(false); // Close the modal after deletion
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  console.log(selectedInterview)

  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        borderRadius: '20px',
      }}
      className="bg-white"
    >
      {/* <BackButton/>  */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#263238', mb: 4 }}
      >
        Manage Behavioral Interviews
      </Typography>

      {/* Add Interview Button */}
      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Interview
        </motion.button>
      </div>

      <Grid container spacing={3} justifyContent="center">
        {interviews && interviews.length > 0 ? (
          interviews.map((interview) => (
            <Grid item xs={12} sm={6} md={4} key={interview._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {interview.picture && (
                    <CardMedia
                      component="img"
                      height="60"
                      image={interview.picture}
                      alt={`${interview.title} image`}
                      sx={{
                        objectFit: 'contain',
                        margin: '10px auto',
                        width: '60%',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF4F', mb: 0.5 }}>
                      {interview.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interview.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#4CAF4F',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        '&:hover': { backgroundColor: '#388E3C' },
                      }}
                      onClick={() => handleEdit(interview)}
                    >
                      Edit Interview
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#4CAF4F',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        '&:hover': { backgroundColor: '#388E3C' },
                      }}
                      onClick={() => handleFetchInterview(interview._id)}
                    >
                      View Questions
                    </Button>
                    <Button
                        variant="contained"
                        sx={{mt: 2, backgroundColor: '#FF5252', color: '#ffffff', fontWeight: 'bold', borderRadius: '20px', '&:hover': { backgroundColor: '#E53935' } }}
                        onClick={() => handleOpenDeleteModal(interview._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-dialog"
        aria-describedby="confirm-delete-interview"
      >
        <DialogTitle id="delete-confirmation-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-interview">
            Are you sure you want to delete this interview? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#999' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: '#FF5252',
              color: '#fff',
              '&:hover': { backgroundColor: '#E53935' },
            }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Typography>No interviews found.</Typography>
        )}
      </Grid>

      {/* Modal for Adding/Editing Interviews */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            borderRadius: '15px',
            boxShadow: 24,
            bgcolor: 'background.paper',
            maxWidth: '800px',
            maxHeight: '80vh',
            margin: 'auto',
            mt: '10%',
            display: 'flex',
            alignItems: 'flex-start',
            overflowY: 'auto',
          }}
        >
          {/* Left Side: Image Upload */}
          <Box sx={{ flex: '1', mr: 2 }}>
            <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#4CAF4F' }}>
              {currentInterview._id ? "Edit Interview" : "Add Interview"}
            </Typography>
            <Card
              sx={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '10px',
                border: '1px dashed #ccc',
              }}
            >
              {imagePreview ? (
                <CardMedia
                  component="img"
                  image={imagePreview}
                  alt="Preview"
                  sx={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }}
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
                display: 'block',
                margin: '20px auto 0',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
          </Box>

          {/* Right Side: Title and Description */}
          <Box sx={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="mt-12">
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={currentInterview.title}
              onChange={(e) => setCurrentInterview({ ...currentInterview, title: e.target.value })}
              className="mb-4"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: '10px',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={currentInterview.description}
              onChange={(e) => setCurrentInterview({ ...currentInterview, description: e.target.value })}
              multiline
              rows={4}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: '10px',
                },
              }}
            />

            <Box sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                sx={{ mr: 1, backgroundColor: '#4CAF4F', '&:hover': { backgroundColor: '#388E3C' } }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{ color: '#4CAF4F', borderColor: '#4CAF4F' }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BehavioralAdmin;

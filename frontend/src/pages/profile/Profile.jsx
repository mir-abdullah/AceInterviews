/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Paper,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FaCamera, FaKey, FaSave, FaTrashAlt } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateProfile,
  confirmOldPassword,
  changePassword,
  deleteProfile,
} from "../../redux/slices/user/user.slice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading,
    profileUpdateStatus,
    profileUpdateError,
    oldPasswordStatus,
    oldPasswordStatusError,
    deleteProfileStatus,
    deleteProfileError,
  } = useSelector((state) => state.user);

  // Local state for form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [image, setImage] = useState("");

  // State for password confirmation
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

  const navigate = useNavigate();

  // Fetch user profile when component mounts
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update local state when userProfile is fetched or updated
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setImage(user.profilePic || "");
    }
  }, [user]);

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  // Handle old password confirmation
  const handleCheckOldPassword = async () => {
    setIsPasswordChanging(true);

    try {
      const response = await dispatch(confirmOldPassword(oldPassword)).unwrap();

      if (response.msg === "Old password confirmed") {
        setIsOldPasswordCorrect(true);
        setOldPasswordError(""); // Clear any previous errors
      } else if (response.msg === "Invalid old Password") {
        setIsOldPasswordCorrect(false);
        setOldPasswordError("Incorrect old password");
      }
    } catch (error) {
      setIsOldPasswordCorrect(false);
      setOldPasswordError("Incorrect password " + (error.message || ""));
    } finally {
      setIsPasswordChanging(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New password and confirmation do not match");
      toast.error("New password and confirmation do not match");
      return;
    }

    if (newPassword === "") {
      setPasswordChangeError("New password cannot be empty");
      toast.error("New password cannot be empty");
      return;
    }

    setIsPasswordChanging(true);

    try {
      const response = await dispatch(changePassword({ newPassword })).unwrap();

      if (response.msg === "Password updated successfully") {
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOldPasswordCorrect(false);
        setPasswordChangeError("");
        setExpanded(false);
      } else {
        setPasswordChangeError(response.msg || "Error changing password");
        toast.error(response.msg || "Error changing password");
      }
    } catch (error) {
      setPasswordChangeError(
        "Error changing password: " + (error.message || "")
      );
      toast.error("Error changing password: " + (error.message || ""));
    } finally {
      setIsPasswordChanging(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    const profileData = {
      name: fullName,
      email: email,
      profilePic: image,
    };

    dispatch(updateProfile(profileData)).then((result) => {
      if (updateProfile.fulfilled.match(result)) {
        // Show success toast
        toast.success("Profile Updated Successfully", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Fetch updated profile after successful update
        dispatch(fetchUserProfile());
      } else {
        // Handle update error if needed
        toast.error("Failed to update profile", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    });
  };

  const handleDeleteProfile = async () => {
    try {
      const resultAction = await dispatch(deleteProfile());

      // Assuming deleteProfile is an async thunk, check for the fulfilled status or the payload
      if (deleteProfile.fulfilled.match(resultAction)) {
        // Assuming resultAction.payload contains the expected message
        if (resultAction.payload?.msg) {
          toast.success("Profile deleted successfully!"); // Success toast
          navigate("/"); // Redirect to home or login page
        }
      } else {
        // Handle if not fulfilled but rejected
        toast.error("Failed to delete profile. Please try again."); // Error toast
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error deleting profile: " + (error.message || "")); // Error toast
    }
  };

  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      dispatch(fetchUserProfile());
    }
  }, [profileUpdateStatus, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        // background: "linear-gradient(135deg, #4A90E2, #A3E4DB, #F5D76E)",
        
      }}
      className="bg-gray-50"
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "800px",
          padding: "40px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Header and Profile Picture */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#263238",
              marginBottom: "20px",
            }}
          >
            Profile Settings
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              alt="Profile Picture"
              src={image || "https://via.placeholder.com/150"}
              sx={{
                width: 120,
                height: 120,
                marginBottom: "10px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <input
              style={{ display: "none" }}
              id="upload-profile-pic"
              type="file"
              onChange={handleImage}
            />
            <label htmlFor="upload-profile-pic">
              <Button component="span" sx={{ color: "#4CAF4F" }}>
                <FaCamera size={20} />
              </Button>
            </label>
          </Box>
        </Box>

        {/* Profile Form */}
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />

          {/* Change Password Section */}
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{
              marginTop: "20px",
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4CAF4F" }}
              >
                Change Password
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingTop: 0 }}>
              {isPasswordChanging ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  sx={{ marginBottom: "20px" }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    error={!!oldPasswordError}
                    helperText={oldPasswordError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                          borderColor: "red",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: isOldPasswordCorrect
                            ? "green"
                            : undefined,
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4CAF4F",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#388E3C",
                      },
                      marginBottom: "20px",
                    }}
                    onClick={handleCheckOldPassword}
                    startIcon={<FaKey />}
                  >
                    Confirm Old Password
                  </Button>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    disabled={!isOldPasswordCorrect}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    disabled={!isOldPasswordCorrect}
                  />
                  {passwordChangeError && (
                    <Typography color="error" sx={{ marginTop: "10px" }}>
                      {passwordChangeError}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#4CAF4F",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#388E3C",
                      },
                      marginTop: "20px",
                    }}
                    disabled={newPassword !== confirmPassword || !newPassword}
                    onClick={handleChangePassword}
                    startIcon={<FaKey />}
                  >
                    Change Password
                  </Button>
                </>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Update and Delete Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF4F",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#388E3C",
                  },
                }}
                onClick={handleUpdateProfile}
                disabled={profileUpdateStatus === "loading"}
                startIcon={<FaSave />}
              >
                {profileUpdateStatus === "loading"
                  ? "Updating..."
                  : "Update Profile"}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteProfile}
                disabled={deleteProfileStatus === "loading"}
                startIcon={<FaTrashAlt />}
              >
                {deleteProfileStatus === "loading"
                  ? "Deleting..."
                  : "Delete Account"}
              </Button>
            </motion.div>
          </Box>

          {profileUpdateError && (
            <Typography color="error" sx={{ marginTop: "20px" }}>
              Error updating profile: {profileUpdateError}
            </Typography>
          )}

          {deleteProfileError && (
            <Typography color="error" sx={{ marginTop: "10px" }}>
              Error deleting profile: {deleteProfileError}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;

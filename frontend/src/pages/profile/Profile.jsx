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
import { FaCamera } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

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

  const navigate =useNavigate();

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
      setOldPasswordError(
        "Incorrect password " + (error.message || "")
      );
    } finally {
      setIsPasswordChanging(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New password and confirmation do not match");
      return;
    }

    if (newPassword === "") {
      setPasswordChangeError("New password cannot be empty");
      return;
    }

    setIsPasswordChanging(true);

    try {
      const response = await dispatch(changePassword({ newPassword })).unwrap();

      if (response.msg === "Password updated successfully") {
        alert("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsOldPasswordCorrect(false); // Reset after successful change
        setPasswordChangeError(""); // Clear any previous errors
        setExpanded(false);
      } else {
        setPasswordChangeError(response.msg || "Error changing password");
      }
    } catch (error) {
      setPasswordChangeError(
        "Error changing password: " + (error.message || "")
      );
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
    dispatch(updateProfile(profileData)).then(() => {
      // Fetch updated profile after successful update
      dispatch(fetchUserProfile());
    });
  };

  const handleDeleteProfile = async () => {
    try {
      const resultAction = await dispatch(deleteProfile());
      
      // Assuming deleteProfile is an async thunk, check for the fulfilled status or the payload
      if (deleteProfile.fulfilled.match(resultAction)) {
        // Assuming resultAction.payload contains the expected message
        if (resultAction.payload?.msg) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };
  

  // Effect to handle profile update success or error
  useEffect(() => {
    if (profileUpdateStatus === "succeeded") {
      // Refresh user profile after successful update
      dispatch(fetchUserProfile());
    }
  }, [profileUpdateStatus, dispatch]);

  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className="bg-gradient-to-t from-lime-100 to-cyan-100"
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          borderRadius: "15px",
          backgroundColor: "#ffffff",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#263238" }}
            >
              Profile Settings
            </Typography>

            <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
              <Avatar
                alt="Profile Picture"
                src={image || "https://via.placeholder.com/150"}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  marginBottom: "10px",
                }}
              />
              <input
                style={{ display: "none" }}
                id="upload-profile-pic"
                type="file"
                onChange={handleImage}
              />
              <label htmlFor="upload-profile-pic">
                <IconButton component="span">
                  <FaCamera size={20} color="#4CAF4F" />
                </IconButton>
              </label>
            </Box>

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
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
            />

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
                          borderColor: isOldPasswordCorrect ? "green" : "",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isOldPasswordCorrect ? "green" : "",
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
                    >
                      Change Password
                    </Button>
                  </>
                )}
              </AccordionDetails>
            </Accordion>

            <Button
              variant="contained"
              sx={{
                marginTop: "20px",
                backgroundColor: "#4CAF4F",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#388E3C",
                },
              }}
              onClick={handleUpdateProfile}
              disabled={profileUpdateStatus === "loading"}
            >
              {profileUpdateStatus === "loading"
                ? "Updating..."
                : "Update Profile"}
            </Button>

            {profileUpdateError && (
              <Typography color="error" sx={{ marginTop: "20px" }}>
                Error updating profile: {profileUpdateError}
              </Typography>
            )}
          </>
        )}
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
          >
            {deleteProfileStatus === "loading"
              ? "Deleting..."
              : "Delete Profile"}
          </Button>

          {deleteProfileError && (
            <Typography color="error">
              Error deleting profile: {deleteProfileError}
            </Typography>
          )}
        </motion.div>
      </Paper>
    </Box>
  );
};

export default Profile;

import User from "../../models/user/user.js";
import express from "express";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../../utils/nodeMailer.js";
import { auth } from "../../middleware/auth.js";
import multer from "multer";
import {
  deleteProfileController,
  forgotPasswordController,
  getProfileController,
  loginController,
  resetPasswordController,
  signupController,
  updateAcoount,
  uploadProfilePicController,
  verifyEmailController,
  logoutController,
  confirmOldPasswordController,
  sendOtpController,
  verifyOtpController,
  handleGoogleLogin,
  calculateTotalUsers
 
  
} from "../../controllers/user/user.js";

const router = express.Router();
const storage = multer.memoryStorage();


//signup route

router.post("/signup", signupController);

//verify email route
router.get("/verify-email", verifyEmailController);

//login route
router.post("/login", loginController);

//route to upload profile picture
router.patch("/upload-profile-picture", auth, uploadProfilePicController);

// forgot password route
router.post("/forgot-password", forgotPasswordController);

// reset password route
router.post("/reset-password",auth, resetPasswordController);

//get user profile
router.get("/profile", auth, getProfileController);

//delete account
router.delete("/delete-profile", auth, deleteProfileController);

//update Account information
router.put("/update-profile", auth, updateAcoount);

//logout route
router.post("/logout", auth, logoutController);

//confirm old password
router.post("/confirm-old-password", auth, confirmOldPasswordController);

//send otp
router.post('/send-otp',sendOtpController)

//verify otp
router.post('/verify-otp',verifyOtpController)



//google login
router.post('/google-login',handleGoogleLogin)

//count users
router.get('/count-users',calculateTotalUsers)




export default router;

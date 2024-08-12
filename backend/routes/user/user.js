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
  logoutController
} from "../../controllers/user/user.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinaryConfig = cloudinary.config({
  cloud_name: "dft2urwa8",
  api_key: "833392216123692",
  api_secret: "KRiko4Xdu6OMb-EN6NAtQ33PJkY",
});

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
router.post("/reset-password", resetPasswordController);

//get user profile
router.get("/profile", auth, getProfileController);

//delete account
router.delete("/delete-profile", auth, deleteProfileController);

//update Account information
router.put("/update-profile", auth, updateAcoount);

//logout route
router.get("/logout", auth, logoutController);


export default router;

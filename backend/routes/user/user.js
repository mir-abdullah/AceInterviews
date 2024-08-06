import User from "../../models/user/user.js";
import express from "express";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../../utils/nodeMailer.js";
import { auth } from "../../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinaryConfig = cloudinary.config({
  cloud_name: "dft2urwa8",
  api_key: "833392216123692",
  api_secret: "KRiko4Xdu6OMb-EN6NAtQ33PJkY",
});

//signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    const verificationUrl = `http://localhost:4000/api/user/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: 'AceInterviews <no-reply@aceinterviews.com>',
      to: email,
      subject: "Email Verification",
      html: `
        <p>Hello,</p>
        <p>Follow this link to verify your email address.</p>
        <p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p>If you didn’t ask to verify this address, you can ignore this email.</p>
        <p>Thanks,</p>
        <p>Your AceInterviews team</p>
      `,
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return res.status(200).send({
      msg: "User created successfully. Please verify your email.",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal server Error" });
  }
});

//verify email route
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).send({ msg: "Invalid verification token" });
  }
  user.isVerified = true;
  user.verificationToken = "";
  await user.save();
  return res.status(200).send({ msg: "Email verified successfully" });
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ msg: "Email not verified. Please verify your email." });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {});
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error Try again later" });
  }
});

//route to upload profile picture
router.post("/upload-profile-picture", upload.single("profilePicture"),auth, async (req, res) => {
  try {
    const userId = req.userId; // Ensure req.userId is set correctly
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'profile_pictures' }, (error, result) => {
      if (error) {
        return res.status(400).json({ msg: "Error uploading profile picture" });
      }

      // Update user's profile picture URL
      user.profilePic = result.secure_url;
      user.save().then(() => {
        res.status(200).json({ msg: "Profile picture uploaded successfully", profilePic: result.secure_url });
      }).catch(err => {
        res.status(500).json({ msg: "Error saving user profile picture" });
      });
    });

    // Stream the file to Cloudinary
    file.stream.pipe(uploadStream);

  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ msg: "Error uploading profile picture" });
  }
});


      








export default router

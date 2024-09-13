import User from "../../models/user/user.js";
import express from "express";
import cloudinary from "../../utils/cloudinaryConfig.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../../utils/nodeMailer.js";



//signup controller
export const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ msg: "Email already exists" });
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

    const verificationUrl = `http://localhost:4444/api/user/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: "AceInterviews <no-reply@aceinterviews.com>",
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
};


//login controller
export const loginController = async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.cookie("token",token)
    return res
      .status(500)
      .json({ msg: "Internal server error Try again later" });
  }
};

// verify email controller
export const verifyEmailController = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).send({ msg: "Invalid verification token" });
  }
  user.isVerified = true;
  user.verificationToken = "";
  await user.save();
  return res.status(200).send({ msg: "Email verified successfully" });
};

//reset password controller
export const resetPasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId; // Ensure this is set correctly by authentication middlewareclg
    console.log(typeof(newPassword))

    if (!newPassword) {
      return res.status(400).json({ msg: "Please provide a new password" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = ""; // Ensure this field exists in your schema and is used appropriately
    await user.save();

    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error('Error updating password:', error); // Improved error logging
    return res.status(500).json({ msg: "Internal server error" });
  }
};
//   forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide token and new password" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//get user profile controller
export const getProfileController = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error. Please try again later." });
  }
};
//delete account controller
export const deleteProfileController = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send("user not found");
    }
    return res.status(200).json({ msg: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error try again later");
  }
};
//update profile controller
export const updateAcoount = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('user id', userId);

    const { name, email, profilePic } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Update user fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle profile picture update
    if (profilePic) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pictures",
      });
      user.profilePic = result.secure_url;
    }

    // Save the updated user
    await user.save();

    // Send updated user data in the response
    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ msg: "Error updating profile" });
  }
};

//update profile pic
export const uploadProfilePicController = async (req, res) => {
  try {
    const userId = req.userId; 
    const {image} = req.body

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if a file is provided
    if (!image) {
      return res.status(400).json({ msg: "No image file provided" });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "profile_pictures",
    });

    // Update user profile picture URL
    user.profilePic = result.secure_url;
    await user.save();

    // Respond with success
    return res.status(200).json({
      msg: "Profile picture uploaded successfully",
      profilePic: result.secure_url,
    });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    return res.status(500).json({ msg: "Error uploading profile picture" });
  }
};


//logout controller
export const logoutController = async (req, res) => {
    try {
        res.clearCookie('token', {
          httpOnly: true,
          secure: false, 
          sameSite: 'strict',
        });
        
        res.status(200).json({ msg: 'Logged out successfully' });
      } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ msg: 'Internal server error' });
      }
    }

    //route to confirm old password
    export const confirmOldPasswordController = async (req, res) => {
      try {
        const { oldPassword } = req.body;
        
        // Assuming `userId` is passed via token middleware and added to req object
        const userId = req.userId; 
       
    
        // Ensure userId is available
        if (!userId) {
          return res.status(400).json({ msg: "User ID is required" });
        }
    
        // Fetch user by their ID
        const user = await User.findById(userId);
        
        // Ensure user exists
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
    
        // Ensure user has a password
        // if (!user.password) {
        //   return res.status(400).json({ msg: "User password not found" });
        // }
        console.log(oldPassword)
    
        // Compare the old password with the hashed password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    
        if (!isValidPassword) {
          return res.status(400).json({ msg: "Invalid old password" });
        }
    
        // Password is valid
        return res.status(200).json({ msg: "Old password confirmed" });
        
      } catch (error) {
        console.error('Error confirming old password:', error);
        return res.status(500).json({ msg: 'Internal server error', error: error.message });
      }
    };

import Admin from "../../models/admin/admin.js";
import bcrypt from "bcryptjs";

//create admin
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin.email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email " });
    }

    const isMatch = password === admin.password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res
      .status(200)
      .json({ message: "Login successful", admin: admin.email });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

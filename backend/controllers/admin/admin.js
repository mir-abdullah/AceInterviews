import Admin from '../../models/admin/admin.js'
import bcrypt from 'bcryptjs'

//create admin
export const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email is already taken
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create new admin
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();

        // Return success message
        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//login admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email ' });
        }

        // Compare the password
        const isMatch = password === admin.password;
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful', admin: admin.email });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};  
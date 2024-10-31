import React, { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  TextField,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import { FaUserPlus, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Initial Static Admins
const initialAdmins = [
  {
    username: "Admin1",
    email: "admin1@aceinterview.com",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    createdAt: "2023-08-10",
  },
  {
    username: "Admin2",
    email: "admin2@aceinterview.com",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    createdAt: "2023-09-05",
  },
];

const ProfileAdmin = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Handle admin deletion
  const handleDeleteAdmin = (index) => {
    const updatedAdmins = admins.filter((_, i) => i !== index);
    setAdmins(updatedAdmins);
  };

  // Handle opening the modal to add new admin
  const handleOpenAddAdminModal = () => {
    setOpenAddAdminModal(true);
  };

  // Handle closing the modal
  const handleCloseAddAdminModal = () => {
    setOpenAddAdminModal(false);
  };

  // Handle adding a new admin
  const handleAddAdmin = () => {
    const { username, email } = newAdmin;
    if (username && email) {
      setAdmins([
        ...admins,
        {
          username,
          email,
          avatarUrl: `https://i.pravatar.cc/150?u=${email}`, 
          createdAt: new Date().toISOString().split("T")[0], // 
        },
      ]);
      setNewAdmin({ username: "", email: "", password: "" });
      handleCloseAddAdminModal();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <Typography
        variant="h4"
        className="text-center font-bold mb-8 text-gray-700"
      >
        Admin Management
      </Typography>

      {/* Existing Admins List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {admins.map((admin, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  alt={admin.username}
                  src={admin.avatarUrl}
                  sx={{ width: 56, height: 56 }}
                />
                <Stack>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    {admin.username}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {admin.email}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Created on: {admin.createdAt}
                  </Typography>
                </Stack>
              </Stack>

              {/* Delete Admin Icon */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<FaTrashAlt />}
                onClick={() => handleDeleteAdmin(index)}
              >
                Delete Admin
              </Button>
            </Stack>
          </motion.div>
        ))}
      </motion.div>

      {/* Add New Admin Button */}
      <motion.div
        className="flex justify-center mt-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaUserPlus />}
          onClick={handleOpenAddAdminModal}
        >
          Add New Admin
        </Button>
      </motion.div>

      {/* Modal to Add New Admin */}
      <Modal open={openAddAdminModal} onClose={handleCloseAddAdminModal}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 m-6 mx-auto w-full max-w-md"
        >
          <Typography variant="h6" className="mb-4 text-gray-700 text-center">
            Add New Admin
          </Typography>
          <TextField
            label="Username"
            fullWidth
            className="mb-4"
            value={newAdmin.username}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            className="mb-4"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            className="mb-4"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddAdmin}
          >
            Save Admin
          </Button>
        </motion.div>
      </Modal>
    </div>
  );
};

export default ProfileAdmin;

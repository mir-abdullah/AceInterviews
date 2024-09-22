import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoBell } from 'react-icons/go';
import administrator from  '../../assets/administrator.png'
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Grow,
} from '@mui/material';

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens)
    navigate('/admin/login'); // Redirect to home after logout
  };

  return (
    <div className="w-full bg-gradient-to-tl from-green-900 to-teal-400 shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center">
        <p className="ml-3 text-xl font-semibold text-white">
          {  "Welcome Admin 👋,Lets Manage your system " }
        </p>
      </div>
      <div className="flex items-center space-x-5">
        {/* Profile Image */}
        <img
          className="w-10 h-10 rounded-full border-4 border-white cursor-pointer"
          src={administrator}
          alt="User Profile"
          onClick={handleProfileMenuClick}
        />

        {/* Profile Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseProfileMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 4,
            style: { width: '200px', padding: '10px' },
          }}
          TransitionComponent={Grow} // Using MUI's built-in Grow transition
        >
          <MenuItem onClick={handleLogout}>Signout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Header;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoBell } from 'react-icons/go';
import {
  Menu,
  MenuItem,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Grow,
} from '@mui/material';
import { fetchUserProfile } from '../../redux/slices/user/user.slice.js'

const Header = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user); // Access user state


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationEl, setNotificationEl] = React.useState(null);

  const notifications = [
    'Your interview is scheduled for tomorrow at 10 AM.',
    "New message from Alex: 'Don't forget the mock interview!'",
    'You have 3 new quizzes to complete this week.',
  ];

  useEffect(() => {
    dispatch(fetchUserProfile()); // Fetch user profile on component mount
  }, [dispatch]);

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClick = (event) => {
    setNotificationEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseNotificationMenu = () => {
    setNotificationEl(null);
  };

  return (
    <div className="w-full bg-gray-100 shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-indigo-800">Welcome Back!</h1>
        <p className="ml-3 text-xl font-semibold text-gray-700">
          {loading ? 'Loading...' : user ? user.name : ''}
        </p>
      </div>
      <div className="flex items-center space-x-5">
        <div className="hidden md:flex">
          {/* Search Input (optional, hidden for now) */}
        </div>
        <div className="flex items-center space-x-5">
          {/* Notification Icon */}
          <IconButton onClick={handleNotificationMenuClick}>
            <Badge badgeContent={notifications.length} color="error">
              <GoBell size={28} />
            </Badge>
          </IconButton>

          {/* Notification Dropdown */}
          <Menu
            anchorEl={notificationEl}
            open={Boolean(notificationEl)}
            onClose={handleCloseNotificationMenu}
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
              style: { width: '300px', padding: '10px' },
            }}
            TransitionComponent={Grow} // Using MUI's built-in Grow transition
          >
            <Typography variant="subtitle1" sx={{ paddingLeft: 2 }}>
              Notifications
            </Typography>
            <Divider />
            <List>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <ListItem key={index} sx={{ paddingTop: 2, paddingBottom: 2 }}>
                    <ListItemText primary={notification} />
                  </ListItem>
                ))
              ) : (
                <MenuItem>No new notifications</MenuItem>
              )}
            </List>
          </Menu>

          {/* Profile Image */}
          <img
            className="w-10 h-10 rounded-full border-4 border-indigo-400 cursor-pointer"
            // src="https://randomuser.me/api/portraits/women/50.jpg"
            src={user?.profilePic}
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
            <MenuItem onClick={handleCloseProfileMenu}>My Profile</MenuItem>
            <MenuItem onClick={handleCloseProfileMenu}>Signout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;

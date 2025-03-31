import React from "react"; // Import React
import { AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material"; // Import Material UI components for Navbar
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon for user account
import LogoutIcon from "@mui/icons-material/Logout"; // Icon for logout
import HomeIcon from '@mui/icons-material/Home'; // Icon for home
import sessionStore from "../store/SessionStore"; // Import session store for session management
import { useState } from "react"; // Import useState hook to manage component state
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation between pages

const Navbar = () => {
  // useNavigate hook is used to programmatically navigate to other routes
  const navigate = useNavigate();

  // useState hook for managing the state of the menu anchor (whether it's open or closed)
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle opening the menu when the user clicks the account icon
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set the anchor element to the current target (the clicked icon)
  };

  // Handle closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null); // Reset the anchor element, closing the menu
  };

  // Handle logout functionality: close the menu, navigate to the home page, and call logout in sessionStore
  const handleLogout = () => {
    handleMenuClose(); // Close the menu
    navigate("/"); // Navigate to the home page
    sessionStore.logout(); // Call the logout method to update session store
  };

  return (
    <AppBar position="fixed" style={{ height: "40px", backgroundColor: '#282c34' }}>
      {/* AppBar component from Material UI for the fixed navbar */}
      <Toolbar
        style={{
          minHeight: "40px",
          height: "40px",
          padding: "0 10px",
          alignItems: "center",
        }}
      >
        {/* Toolbar component to wrap the elements inside the navbar */}
        <Typography
          variant="h6"
          style={{
            flexGrow: 1, // This makes the Typography take up all available space
            fontSize: "14px", // Set font size
            display: "flex",
            alignItems: "center", // Vertically center the text
          }}
        >
          Price Optimization Tool
          {/* Title of the app displayed in the navbar */}
        </Typography>
        
        {/* Account Circle Icon, clicking this will open the menu */}
        <AccountCircleIcon fontSize="large" onClick={handleMenuOpen} />

        {/* Menu component, anchored to the Account Circle Icon */}
        <Menu
          anchorEl={anchorEl} // Set the anchor element for the menu
          open={Boolean(anchorEl)} // Open menu if anchorEl is set (not null)
          onClose={handleMenuClose} // Close the menu on clicking outside
          PaperProps={{
            elevation: 3, // Apply shadow to the menu
            style: { minWidth: "150px" }, // Set the minimum width of the menu
          }}
        >
          {/* Conditional rendering based on session store's login status */}
          {sessionStore.isLoggedIn ? (
            <>
              {/* Display username as a disabled menu item */}
              <MenuItem disabled>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  {sessionStore.user?.username}
                </Typography>
              </MenuItem>
              {/* Logout menu item */}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" /> {/* Logout icon */}
                </ListItemIcon>
                Logout
              </MenuItem>
            </>
          ) : (
            <>
              {/* Home menu item if the user is not logged in */}
              <MenuItem onClick={() => navigate("/")}>
                <ListItemIcon>
                  <HomeIcon fontSize="small" /> {/* Home icon */}
                </ListItemIcon>
                Home
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; // Export Navbar component for use in other parts of the app
